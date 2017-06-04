const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('guitars', {
        title: 'Guitars',
        User:req.user })
});

module.exports = router;