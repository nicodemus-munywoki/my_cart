// require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const axios = require('axios');
const connectDB = require('./db');

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(methodOverride('_method'));

const Product = require('./server/models/product');

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(layouts);
app.use(express.static('public'));
app.set('layout', './layout/main')
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/index_user'));

app.get('*',(req, res)=>{
  res.send('Hello from your web server! You got a 404 error.')
})

app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
})