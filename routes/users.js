"use strict"

const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('upload');
})
router.get('/register', (req, res, next) => {
    res.render('users/register');
})

module.exports=router;