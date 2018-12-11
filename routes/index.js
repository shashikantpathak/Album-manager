"use strict"

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images/uploads'});
const admin = require("firebase-admin");
var ref = admin.app().database().ref();

router.get('/', (req, res, next) => {
    res.render('index');
})
module.exports=router;

router.post('/',upload.single('profileimage'),(req,res,next)=>{

    if(req.file){
        console.log('uplaoding');
        var profileimage=req.body.profileimage;
    }else{
        console.log('no imahe');
        var profileimage='noimage.jpg';
    }

    var username=req.body.reg_username;
    var password=req.body.reg_password;
    var password2=req.body.reg_password_confirm;
    var email=req.body.reg_email;
    var fullname=req.body.reg_fullname;
    var profileimage=profileimage

    req.checkBody('username','Username can not be empty').notEmpty();
    req.checkBody('password','Password can not be empty').notEmpty();
    req.checkBody('email','Email can not be empty').notEmpty();
    req.checkBody('fullname','fullname can not be empty').notEmpty();
    req.checkBody('password2','password does not match').equals(req.body.password);
    req.checkBody('email','Enter correct Email ').isEmail();

    var errors = req.validationErrors();
    if(errors){
		res.render('index', {
			errors: errors
		});
	} else {
      ref.createUser({
			email: email,
			password: password
		}, function(error, userData){
			if(error){
				console.log("Error creating user: ", error);
			} else {
				console.log("Successfully created user with uid:",userData.uid);
				var user = {
					uid: userData.uid,
					email: email,
					fullname: fullname,
					username: username,
					profileimage: profileimage
				}

				var userRef = ref.child('users');
				userRef.push().set(user);

				req.flash('success_msg', 'You are now registered and can login');
				res.redirect('/albums/index');
			}
		});
	}
});

   
