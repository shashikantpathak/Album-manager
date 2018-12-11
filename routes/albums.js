"use strict"

const express = require('express');
const router = express.Router();
const async = require('async');
const multer = require('multer');
const upload = multer({ dest: './public/images/uploads' });
const admin = require("firebase-admin");
var ref = admin.app().database().ref();

var stack = {};
stack.Genre = function (callback) {
    var genreRef = ref.child('genres');
    genreRef.once('value', function (snapshot) {
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            data.push({
                id: key,
                genre: childData.genre
            });
        });
        callback(null, { genres: data });
    })
}

stack.Album = function (callback) {
    var albumRef = ref.child('album');
    albumRef.once('value', function (snapshot) {
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            data.push({
                id: key,
                genre: childData.genre,
                cover: childData.cover,
                albumname: childData.albumname
            });
        });
        callback(null, { albums: data });
    })
}
stack.Song = function (callback) {
    var albumRef = ref.child('song');
    albumRef.once('value', function (snapshot) {
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            data.push({
                id: key,
                song: childData.song
            });
        });
        callback(null, { song: data });
    })
}
router.get('/index', function (req, res, next) {
    async.parallel(stack, function (err, result) {
        const result1 = result.Genre.genres;
        const result2 = result.Album.albums;
        const result3=result.Song.song;
        
        res.render('albums/index', { genres: result1, albums: result2,songs:result3 });
    })
});

router.get('/details/:id', (req, res, next) => {
    var id = req.params.id;
    var ref = admin.app().database().ref('/album/' + id);

    ref.once('value', function (snapshot) {
        var album = snapshot.val();
        res.render('albums/details', { album: album, id: id });

    })

});

router.get('/edit/:id', (req, res, next) => {
    var id = req.params.id;
    var ref = admin.app().database().ref('/album/' + id);
    ref.once('value', function (snapshot) {
        var album = snapshot.val();
        res.render('albums/edit', { album: album, id: id });
    })

});
router.post('/edit/:id', (req, res, next) => {
    var id = req.params.id;
    var albumname = req.body.albumname;
    var ref = admin.app().database().ref('/album/' + id);
    ref.update({
        albumname: albumname
    });
    ref.once('value', function (snapshot) {
        var album = snapshot.val();
        res.render('albums/edit', { album: album, id: id });
    })
});



router.delete('/delete/:id',function(req,res){
    var id = req.params.id;
    var ref = admin.app().database().ref('/album/' + id);
    ref.remove();
    res.send(200);
})
// router.post('/index', upload.single('cover'), function (req, res, next) {
//     if (req.file) {
//         console.log('Uploading')
//         var cover = req.file.filename
//     } else {
//         console.log('error')
//         var cover = 'noimage.jpg';
//     }
//     var album = {
//         albumname: req.body.albumname,
//         genre: req.body.genre,
       
//         song:req.body.song
//     }
//     var albumRef = ref.child("album");
//     albumRef.push().set(album);
//     req.flash('success_msg', 'Album Saved');
//     res.redirect('/albums/index');
// });

router.post('/index', upload.single('song'), function (req, res, next) {
    if (req.file) {
        console.log('Uploading')
        var song = req.file.filename
    } else {
        console.log('error')
        var song = 'nosong.mp3';
    }
    var song={
        song:song
    }
    var metadata = {
        contentType: 'audio/mp3',
      };
      var albumRef = ref.child("song");
          albumRef.push().set(song);
          req.flash('success_msg', 'song Saved');
          res.redirect('/albums/index');
      });
module.exports = router;

