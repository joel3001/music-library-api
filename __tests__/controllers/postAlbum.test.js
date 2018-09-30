const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('POST Album endpoint', () => {
    beforeAll((done) => {
        mongoose.connect(process.env.TEST_DATABASE_CONN, done);
      });

    it('Should add an album to an Artist', (done) => {
        const artist = new Artist({ name: 'Mac DeMarco', genre: 'Indie' });
        artist.save((err, artistCreated) => {
          if (err) {
            console.log(err, 'stuff went wrong');
          }

          const request = httpMocks.createRequest({
            method: 'POST',
            URL: `/artist/${artistCreated._id}/album`, 
            params: {
              artistId: artistCreated._id, 
            },
            body: {
              name: 'Salad Days',
              year: 2012,
            },
          });
          
          const response = httpMocks.createResponse({
            eventEmitter: events.EventEmitter,
          });

          postAlbum(request, response);

          response.on('end', () => {
            Artist.findById(artistCreated._id, (err, foundArtist) => {
                console.log(foundArtist)
                expect(foundArtist.albums.length).toEqual(1);
              
                done();              
          });   
        })
    });
});

    afterEach((done) => {
        Artist.collection.drop((e) => {
        if (e) {
            console.log(e);
        }
        done();
        });
    });
  
    afterAll(() => {
        mongoose.connection.close();
    });          
});