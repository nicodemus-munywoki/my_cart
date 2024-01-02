// require('dotenv').config();
const express = require('express');
var session =require('express-session');
// var passport =require('passport');
const cors = require('cors');
const layouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const axios = require('axios');
const mongoStore = require('connect-mongo');
const connectDB = require('./db');

connectDB();
const app = express();
const PORT = process.env.PORT;
const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const short_code = process.env.SHORT_CODE;
const pass_key = process.env.PASS_KEY;

app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({ mongoUrl: process.env.MONGODB_URI}),
  cookie: { maxAge: 180 * 60 * 1000}
}));
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

app.get('/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    console.log('Received Image URL:', imageUrl);

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    console.log('Axios Response:', response);

      res.set({
        'Content-Type': response.headers['content-type'],
        'Access-Control-Allow-Origin': '*', // Replace * with the specific origin(s) allowed
      });
    res.send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
const generateToken = async (req, res, next) => {
  const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

  await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }).then((response) => {
      console.log(response.data.access_token);
      let token = response.data.access_token;
      // next();    
    })
    .catch((err) => {
    console.error(err);
     // Forward the error to the error handler
  })
};
const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return timestamp;
};
app.post('/stk', generateToken, async (req, res, next) => {
  const timeStamp = generateTimestamp();
  // generateToken();
  const password = new Buffer.from(short_code + pass_key + timeStamp).toString('base64');
  const phoneNumber = req.body.transaction.substring(1);
  await axios.post( "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", 
  {    
     "BusinessShortCode": short_code,    
     "Password": password,    
     "Timestamp":timeStamp,    
     "TransactionType": "CustomerBuyGoodsOnline",    
     "Amount": "1",    
     "PartyA": `254${phoneNumber}`,    
     "PartyB":short_code,    
     "PhoneNumber":`254${phoneNumber}`,
     "CallBackURL": "https://mydomain.com/pat",    
     "AccountReference": `254${phoneNumber}`,    
     "TransactionDesc":"Test"
  },{
    headers: {
      Authorization :`Bearer ${token}`
    }
  }).then((data) =>{
    console.log(data);
    res.status(200).json(data);
  }).catch((err) =>{console.log(err);});
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(layouts);
app.use(express.static('public'));
app.set('layout', './layout/main')
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/index_user'));

app.get('*', (req, res) => {
  res.status(404).render('404', { layout: false });
});

app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
})