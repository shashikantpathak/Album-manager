"use strict"

const express = require('express');
const router = express.Router();

const admin = require("firebase-admin");
var ref = admin.app().database().ref();


router.get('/index', (req, res, next) => {
    var genreRef=ref.child('genres');

    genreRef.once('value',function(snapshot){
        var data=[];
        snapshot.forEach(function(childSnapshot){
            var key=childSnapshot.key;
            var childData=childSnapshot.val();
            data.push({
                id:key,
                genre:childData.genre
            });
        });
        res.render('genres/index',{genres:data});
    })
})
router.post('/index', (req, res, next) => {
    var genre={
        genre:req.body.genre
    };
  var genreRef=ref.child('genres');
  genreRef.push().set(genre);
  res.redirect('/genres/index');
});

router.delete('/delete/:id',function(req,res){
    var id = req.params.id;
    var ref = admin.app().database().ref('/genres/' + id);
    ref.remove();
    res.send(200);
})
module.exports=router;