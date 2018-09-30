const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Artist = require('./controllers/Artist.js');
const Album = require('./controllers/Album.js');

require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

const app = express();
mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true });
app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Hello MongoDb!'));
app.post('/Artist', Artist.post);
app.get('/Artist', Artist.list);
app.get('/Artist/:artistId', Artist.get);
app.put('/Artist/:artistId', Artist.put);
app.delete('/Artist/:artistId', Artist.deleteArtist);
app.post('Artist/:artistId/album', Album.postAlbum);

app.listen(3000, () => console.log('It works!'));
