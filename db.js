// require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const connectDB = async () => {
  try{
    await mongoose.connect(MONGODB_URI);
    console.log('You are now connected to your database')
  }catch (error){
    console.log(error);
  }
}

module.exports = connectDB;