const Artist = require('../models/Artist.js');

exports.post = (req, res) => {
    const artist = new Artist({ name: req.body.name, genre: req.body.genre });
    artist.save((err, artistCreated) => {
        res.json(artistCreated);
    });
};

exports.list = (req, res) => {
    Artist.find({}, (err, artists) => {
        if (err) {
            res.json('Something went wrong')
        }
        res.json(artists);
    });
};

exports.get = (req, res) => {
    Artist.findById(req.params.artistId, (err, artist) => {
      if (err) {
        res.json('Something went wrong');
      }
      res.json(artist);
    });
};

exports.put = (req, res) => {
    Artist.findById(req.params.artistId, (err, artist) => {
        if (err) {
          res.json('Something went wrong');
        }
    
        artist.set({ name: req.body.name });
        artist.set({ genre: req.body.genre });
    
        artist.save((updateErr, artistUpdated) => {
          if (updateErr) {
            res.json('Could not update');
          }
    
          res.json(artistUpdated);
        });
    });
};

exports.deleteArtist = (req, res) => {
    Artist.findByIdAndRemove(req.params.artistId, err => {
      if (err) {
        res.json('something went wrong');
      }
      res.json('Artist deleted');
    });
  };
     