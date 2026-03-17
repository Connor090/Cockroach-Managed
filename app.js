
require('dotenv').config(); // 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Connect to MongoDB
require('./app_api/models/db');

// Auth model
var passport = require('passport');
require('./app_api/config/passport');

// Routers
var indexRouter = require('./app_server/routes/index');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index');

var app = express();

/* ----------------CORS------------*/
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200',   // allow Angular dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] // Added Authorization
}));

/* ----View Engine Setup------- */
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Register Handlebars Partials
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

/* ---------Middleware------------- */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files (CSS, images, HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Initialize passport
app.use(passport.initialize());

/* -----------Routes---------------- */
app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);   

/* -------------404 Handler-------------- */
app.use(function (req, res, next) {
    next(createError(404));
});

/* ----------------Error Handlers------------ */

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res
            .status(401)
            .json({ "message": err.name + ": " + err.message });
    }
});

// General error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;