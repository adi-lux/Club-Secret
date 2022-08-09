require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const logger = require('morgan');
const User = require('./models/user');
const indexRouter = require('./routes/index');

const mongoose = require('mongoose')
const mongo = process.env.MONGO_URI
mongoose.connect(mongo, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('connection successful!'))
        .catch(() => console.log('error connecting to MongoDB'))

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.serializeUser(function (user, done) {done(null, user.id)});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err))
});

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({userName: username}, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('incorrect user')

                return done(null, false, {message: "Incorrect username"});
            }

            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    console.log('correct pass')
                    return done(null, user)
                }
                return done(null, false, {message: 'Incorrect password'})
            })
        });
    })
)

app.use(cookieParser());
app.use(session({secret: 'BlackPink is the revolution', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.curUser = req.user;
    next();
})

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;