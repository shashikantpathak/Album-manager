"use strict"

const express=require('express');
const path=require('path');
const multer=require('multer');
const upload=multer({dest:'./public/images'});
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const bcryptjs=require('bcryptjs');
const cookieParser=require('cookie-parser');
const log=require('morgan');
const bodyParser=require('body-parser');
const admin = require("firebase-admin");

const serviceAccount = require("./public/pb/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

const routers=require('./routes/index');
const albums=require('./routes/albums');
const genres=require('./routes/genres');
const users=require('./routes/users');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.set("views",path.join(__dirname,'views'));
app.set("view engine",'ejs');

app.use(cookieParser());

app.use(flash());
app.use(log('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/',routers);
app.use('/albums',albums);
app.use('/genres',genres);
app.use('/users',users);

app.use('*',function(req,res,next){
    res.render('error');
})

app.listen(process.env.PORT||3000,function(){
    console.log("Connection has been established");
})
