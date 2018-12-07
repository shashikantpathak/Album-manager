"use strict"

const express = require('express');
const router = express.Router();

router.get('/index', (req, res, next) => {
    res.render('genres/index');
})
module.exports=router;