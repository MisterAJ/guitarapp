var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Guitar App',
        User: req.user
    });
});

router.get('/map', function (req, res) {
    res.render('map',{
        title: Map,
        User: req.user,
        API_KEY: process.env.GOOGLE_MAP_API_KEY
    })
});

module.exports = router;
