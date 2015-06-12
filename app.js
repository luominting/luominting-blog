var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');  //收藏图标中间件
var logger = require('morgan');         //日志中间件
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');    //依赖cookie
var MongoStore = require('connect-mongo')(session);  //将session存在数据库  依赖session
var settings = require('./settings');
var forbidden = require('./middleware/forbidden');

var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
var article = require('./routes/article');

var app = express();
app.use(session({
  secret: 'min-blog',
  resave:false,
  saveUninitialized:false,
  store:new MongoStore({
    db: settings.mongoConfig.db,
    host: settings.mongoConfig.host,
    port: settings.mongoConfig.port
  })
}));
app.use(flash());

app.use(forbidden({
  mustLogin:['/users/logout','/article/add'],
  mustNotLogin:['/users/reg','/users/login']
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.error = req.flash('error').toString() || '';
  res.locals.success = req.flash('success').toString() || '';
  res.locals.user = req.session.user;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/article', article);

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
