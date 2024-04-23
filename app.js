var createError = require('http-errors');
var express = require('express');
const { Pool, Client } = require('pg')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var mitgliederRouter = require('./routes/mitglieder');
var haesRouter = require('./routes/haes');
var veranstaltungRouter = require('./routes/veranstaltungen');
var eigentumRouter = require('./routes/eigentum');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/mitglieder', mitgliederRouter);
app.use('/haes', haesRouter);
app.use('/veranstaltungen', veranstaltungRouter);
app.use('/eigentum', eigentumRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
