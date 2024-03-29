
const { db, connectDB, addMail } = require("./database");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const fs = require('fs');
const { crawledWalletData, crawlBitcoinWallets,
  crawledBitcoinHistory, crawlBitcoinHistory,
  clearWalletData, clearBitcoinData } = require('./crawl');
let defaultBitcoinHistory;
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
const { log } = require("console");
app.use(cors({ origin: '*', allowedHeaders: '*', methods: '*' }));

// connectDB();
addMail('lala', 'nana');

app.get('/api-docs', async (req, res) => {
  res.send(JSON.parse(fs.readFileSync("swagger-output.json", "utf-8")));
});
app.get('/', async (req, res) => {
  res.send("<h1>Hello World</h1>");
});
app.get('/get-wallet-data', (req, res) => {
  res.send(crawledWalletData);
});
app.get('/get-bitcoin-history', async (req, res) => {
  const from = req.query.from;
  const until = req.query.until;
  if (from && until) {
    console.log(until - from)
    console.log("Crawling bitcoin history")
    clearBitcoinData();
    crawlBitcoinHistory(from, until)
      .then((data) => { res.send(data); return; })
      .catch((err) => { console.log(err); res.send("ERROR"); return; })
  }
  else {
    console.log("Sending bitcoin history")
    clearBitcoinData();
    crawlBitcoinHistory().then((data) => { res.send(data); return; })
      .catch((err) => { console.log(err); res.send("ERROR"); return; })
  }
});

app.post('/add-subscriber', async (req, res) => {
  console.log(req.body);

  const name = req.body.name;
  const mail = req.query.until;
  res.send('200');

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next(createError(404));
});

crawlBitcoinWallets();
setInterval(() => { clearWalletData(); crawlBitcoinWallets(); }, 15 * 60 * 1000);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

module.exports = app;
