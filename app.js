var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compass = require('node-compass');

var root = require('./routes/root');
var admin = require('./routes/admin');
var welcome = require('./routes/welcome');
var results = require('./routes/results');

var welcomeJSON = require('./routes/welcomeJSON');
var app = express();
var mongoose = require('mongoose');
var config = require('./config');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
  Authorization');
  next();
});
// app.use(compass({
//   project: path.join(__dirname, 'public/sources'),
//   sass: 'layout',
//   css: 'css'
// }));

// connect to the database
mongoose.connect(config.database);

app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', root);
app.use('/welcome', welcomeJSON);
app.use('/admin/*', admin);
app.use('/welcome/*', welcome);
app.use('/results', results);

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
