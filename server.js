const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;
const express = require('express');
const app = express();

app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.set('views','./views');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Lidia:aga19gra@ds119258.mlab.com:19258/database-1');

//new user Schema
const songsSchema = new Schema({
    author: { type: String, required: true },
    title: { type: String, required: true }
});

const Song = mongoose.model('Song', songsSchema);

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/add-songs', function (req, res) {
    res.render('add-songs');
});

app.get('/songs-list', function (req, res) {
    Song.find()
        .then(function(song) {
            res.render('songs-list', {data: song});
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get('/remove/:id', function (req, res) {
    Song.findOneAndRemove({'_id': req.params.id})
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        })
        .then(function() {
            res.redirect('/songs-list');
        })
        .catch(function(err) {
            console.log(err.message);
        });
});

app.post('/addsong', function (req, res) {;
    var newSong = new Song (req.body);
    newSong.save()
        .then(function() {
            res.redirect('songs-list');
        })
        .catch(function(err) {
            console.log(err.message);
        });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});