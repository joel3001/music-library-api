const Artist = require('../models/Artist.js');

exports.post = (req, res) => {
    const artist = new Artist({ name: req.body.name, genre: req.body.genre });
    artist.save((err, artistCreated) => {
        res.json(artistCreated);
    });
};
