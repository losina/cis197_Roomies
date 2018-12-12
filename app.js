var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieSession = require('cookie-session');
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/accounts.js');
var apiRouter = require('./routes/api.js');
var groupRouter = require('./routes/groups.js');
var mapRouter = require('./routes/googleMap.js');
var mongoose = require('mongoose');
var app = express();


app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')))

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/roomies';
mongoose.connect(process.env.MONGODB_URI  || 'mongodb://localhost:27017/roomies');
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/groups', groupRouter);
app.use('/api', apiRouter);
app.use('/map', mapRouter);




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
