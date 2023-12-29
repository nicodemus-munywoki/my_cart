var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: { type: String, required: true },
  productName: { type: String, required: true },
  description: { type: String, required: false },
  instock: { type: Number, required: true },
  P_Id: { type: Number, unique: true }, // Make sure P_Id is unique
  price: { type: Number, required: true },
  ratings: { type: Number, required: false },
  category: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate a unique 6-digit P_Id
schema.pre('save', function (next) {
  // Generate a random 6-digit number
  this.P_Id = Math.floor(100000 + Math.random() * 900000);
  next();
});

module.exports = mongoose.model('Product', schema);
