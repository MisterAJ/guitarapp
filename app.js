const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Routes

const index = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const guitars = require('./routes/guitars');

// MongoDB Models

const User = require('./models/User');

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/return"
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    if (profile.emails[0]) {
        User.findOneAndUpdate({
                emailAddress: profile.emails[0].value
            }, {
                fullName: profile.displayName || profile.username,
                emailAddress: profile.emails[0].value,
                photo: profile.photos[0].value
            }, {
                upsert: true
            },
            done)
    } else {
        const noEmailError = new Error("Your privacy settings prevent you for signing in to this site");
        done(noEmailError, null)
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
    User.findById(userId,done)
});

const app = express();

// Mongoose connection

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/guitarApp");
const db = mongoose.connection;

// Session config for Passport and MongoDB

const sessionOptions = {
    secret: "m3456345nafijkashlvnjkasdvniahsdfgoijasmdglmsadlfkg",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
};

app.use(session(sessionOptions));

// Initialize Passport

app.use(passport.initialize());

// Restore Session
app.use(passport.session());

// MongoDB Connection

db.on("error", function (err) {
    console.error("Connection Error: ", err);
});

db.once("open", function () {
    console.log("db connection was successful");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));


// Routes

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/guitars', guitars);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
