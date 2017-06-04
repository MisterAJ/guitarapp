var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', function (req, res) {
    console.log(req.user);
    res.render('profile', {
        title: 'Profile Page',
        User: req.user})
});

module.exports = router;
