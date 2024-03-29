import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import cors from 'cors';
import createError from 'http-errors';
import {  } from 'swagger-autogen';


import { db, connectDB, addMail } from './database';
import { crawledWalletData, crawlBitcoinWallets, crawledBitcoinHistory, crawlBitcoinHistory, clearWalletData, clearBitcoinData } from './crawl';
import { WalletData } from './types';

let defaultBitcoinHistory: any;
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: '*', allowedHeaders: '*', methods: '*' }));

// connectDB();
addMail('lala', 'nana');

app.get('/api-docs', async (req: Request, res: Response) => {
  res.send(JSON.parse(fs.readFileSync("swagger-output.json", "utf-8")));
});

app.get('/', async (req: Request, res: Response) => {
  res.send("<h1>Hello World</h1>");
});

app.get('/get-wallet-data', (req: Request, res: Response <WalletData[]>) => {
  res.send(crawledWalletData);
});

app.get('/get-bitcoin-history', async (req: Request, res: Response) => {
  const from: any= req.query.from;
  const until: any = req.query.until;
  if (from && until) {
    console.log(until - from)
    console.log("Crawling bitcoin history")
    clearBitcoinData();
    crawlBitcoinHistory(from, until)
      .then((data:any) => { res.send(data); return; })
      .catch((err:any) => { console.log(err); res.send("ERROR"); return; })
  }
  else {
    console.log("Sending bitcoin history")
    clearBitcoinData();
    crawlBitcoinHistory().then((data:any) => { res.send(data); return; })
      .catch((err:any) => { console.log(err); res.send("ERROR"); return; })
  }
});

app.post('/add-subscriber', async (req: Request, res: Response) => {
  const name = req.body.name;
  const mail = req.body.mail;
 const result = await addMail(mail,name);
  if(result != null){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(404);
  }

});

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next(createError(404));
});

crawlBitcoinWallets();
setInterval(() => { clearWalletData(); crawlBitcoinWallets(); }, 15 * 60 * 1000);

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
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

export default app;