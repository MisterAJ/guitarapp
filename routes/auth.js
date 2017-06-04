const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login/github',
    passport.authenticate('github'));

router.get('/github/return',
    passport.authenticate('github', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/')
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
});

module.exports = router;