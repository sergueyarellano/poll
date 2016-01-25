'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compass = require('node-compass');

const root = require('./routes/root');
const admin = require('./routes/admin');
const welcome = require('./routes/welcome');
const results = require('./routes/results');
const closedPoll = require('./routes/closedPoll');
const welcomeJSON = require('./routes/welcomeJSON');

const app = express();
const mongoose = require('mongoose');
const config = require('./config');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// app.use(compass({
//    project: path.join(__dirname, 'public/sources'),
//    sass: 'layout',
//    css: 'css'
//}));

// connect to the database
mongoose.connect(config.databaseReplica);

app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', root);
app.use('/welcome', welcomeJSON);
app.use('/admin/*', admin);
app.use('/welcome/*', welcome);
app.use('/results', results);
app.use('/closedPoll', closedPoll);

// API ROUTES ------------------------
const apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;