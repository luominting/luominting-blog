var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); //收藏图标中间件
var logger = require('morgan');         //日志中间件
var cookieParser = require('cookie-parser');  //解析cookie
var bodyParser = require('body-parser');    //解析body的数据
var flash =require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //把session存在数据库
var settings = require('./settings');
var forbidden = require('./middleware/forbidden');

var routes = require('./routes/index');    //首页
var users = require('./routes/users');     //用户信息
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

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));   //静态文件中间件
// app.use(require('node-compass')({mode: 'expanded'}));

app.use(function(req,res,next){     //模板需要的变量参数需要在这声明，不然回报错
  res.locals.error = req.flash('error').toString() || '';
  res.locals.success = req.flash('success').toString() || '';
  res.locals.user = req.session.user;
  res.locals.count = 0;
  res.locals.pageNum= 0;
  res.locals.pageSize= 0;
  res.locals.totalPage= 0;
  res.locals.keyword='';
  next();
});

app.use('/', routes);
app.use('/users', users);    //访问/users，users是require进来的routes文件夹下面的users文件
app.use('/article', article);    //访问/article，article是require进来的routes文件夹下面的article文件

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler   开发环境下
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

// production error handler    生产环境下
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
