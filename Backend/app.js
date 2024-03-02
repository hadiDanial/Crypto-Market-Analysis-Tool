var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { crawledWalletData, crawlBitcoinWallets, crawledBitcoinHistory, crawlBitcoinHistory, clearData } = require('./crawl');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
const cors = require('cors');
app.use(cors());

app.get('/get-wallet-data', (req, res) => {
  res.send(crawledWalletData);
});
app.get('/get-bitcoin-history', (req, res) => {
  res.send(crawledBitcoinHistory);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


crawlBitcoinWallets();
crawlBitcoinHistory();
setInterval(() => {clearData(); crawlBitcoinWallets();}, 15 * 60 * 1000);
setInterval(() => {clearData(); crawlBitcoinHistory();}, 15 * 60 * 1000);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;