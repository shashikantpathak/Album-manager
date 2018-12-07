"use strict"

const express = require('express');
const router = express.Router();

router.get('/index', (req, res, next) => {
    res.render('albums/index');
});
router.get('/details', (req, res, next) => {
    res.render('albums/details');
});
router.get('/edit', (req, res, next) => {
    res.render('albums/edit');
});

module.exports=router;