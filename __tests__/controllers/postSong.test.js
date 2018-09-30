const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postSong } = require('../../controllers/Song');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');
const Song = require('../../models/Song');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('POST song endpoint', () => {
  beforeAll(done => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      done
    );
  });

  it('should create a song when POST endpoint is called', done => {
    const artist = new Artist({
      name: 'David Bowie',
      genre: 'Rock'
    });

    artist.save((artistCreateErr, artistCreated) => {
      if (artistCreateErr) {
        console.log(err, 'stuff stopped working');
      }

      const album = new Album({
        name: 'Hunky Dory',
        year: 1971,
        artist: artistCreated
      });
      album.save((albumCreateErr, albumCreated) => {
        if (albumCreateErr) {
          console.log(albumCreateErr);
        }

        const request = httpMocks.createRequest({
          method: 'POST',
          url: `/Artist/${artistCreated._id}/song`,
          params: {
            albumId: albumCreated._id
          },
          body: {
            name: 'Life on Mars',
            artistId: artistCreated._id
          }
        });

        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });

        postSong(request, response);

        response.on('end', () => {
          const songCreated = JSON.parse(response._getData());
          expect(songCreated.name).toEqual('Life on Mars');
          expect(songCreated.artist._id).toEqual(artistCreated._id.toString());
          expect(songCreated.album._id).toEqual(albumCreated._id.toString());
          done();
        });
      });
    });
  });
  afterEach(done => {
    Artist.collection.drop(artistDropErr => {
      Album.collection.drop(albumDropErr => {
        Song.collection.drop(songDropErr => {
          if (artistDropErr || albumDropErr || songDropErr) {
            console.log('Can not drop test collections');
          }
          done();
        });
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});