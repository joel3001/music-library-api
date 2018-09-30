const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');

exports.postSong = (req, res) => {
  Album.findById(req.params.albumId, (albumNotFoundErr, album) => {
    if (albumNotFoundErr) {
      res.json('Album does not exist');
    }
    Artist.findById(req.params.artistId, (artistNotFoundErr, artist) => {
      if (artistNotFoundErr) {
        res.json('Artist does not exist');
      }

      const mySong = new Song({
        name: req.body.name,
        artist,
        album
      });

      mySong.save((CreateErr, createdSong) => {
        if (CreateErr) {
          res.join('Could not save song');
        }

        res.json(createdSong);
      });
    });
  });
};