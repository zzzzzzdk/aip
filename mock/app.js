var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var CreateModel = require('./routes/CreateModel');
var TrainingModel = require('./routes/TrainingModel');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * @apiDefine APICommon  全局方法,定义了一个全局apiDoc方法
 * @apiSuccess  {String} message  成功信息
 * @apiSuccess  {Number} status 状态码 <code>20000 成功, 30009、40006、40005 token失效</code>
 */

app.use('*', function (req, res, next) {

  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Admin-Token, Page-Name");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", 'Express');

  req.json = {
    code: 20000,
    message: 'ok'
  }

  req.sleep = function (time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(null)
      }, time * 1000)
    })
  }

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/', CreateModel)
app.use('/', TrainingModel)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
