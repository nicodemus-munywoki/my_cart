var Product = require('../models/product');
const formatNumber = (price) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'KES', // You can adjust the currency based on your requirement
    minimumFractionDigits: 2,
  });
};

exports.home = async (req, res, next) => {
  try {
    const products = await Product.find().exec();

    // Assuming you want to display 5 products per row
    const productsGrouped = [];
    while (products.length > 0) {
      productsGrouped.push(products.splice(0, 5));
    }

    res.render('./shop/home', { products: productsGrouped, formatNumber });
  } catch (err) {
    return next(err);
  }
};



exports.admin = async (req, res, next) => {
    res.render('./admin/admin');
}
exports.mngt = async (req, res, next) => {
  try{
    const products = await Product.find().exec();
    res.render('./admin/management', {products: products});
  } catch (err){
    console.log(err);
  }
    
}
exports.add = async (req, res, next) => {
    res.render('./admin/product');
}
exports.postProduct = async (req, res, next) => {
  console.log(req.body);
  const newProduct = new Product({
      imagePath: req.body.imagePath,
      productName: req.body.productName,
      price: req.body.price,
      instock: req.body.instock,
      category: req.body.category
  });

  try {
      await Product.create(newProduct);
      res.redirect('/admin');
  } catch (error) {
      console.log(error);
  }
}

exports.deleteStudent = async(req, res)=>{
    try {
        await Product.deleteOne({
            _id: req.params.id
        });
        res.redirect(`/admin`);
    } catch (error) {
        console.log(error);
    }

};


// Handle the form submission for editing a product
// exports.editProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     // Update the product based on the form data
//     await Product.findByIdAndUpdate(productId, {
//       imagePath: req.body.imagePath,
//       productName: req.body.productName,
//       price: req.body.price,
//       instock: req.body.instock,
//       category: req.body.category,
//     });

//     res.redirect('/admin'); // Redirect to the admin page after editing
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

exports.viewProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the productId is null or "null"
    if (!productId || productId === 'null') {
      // Handle the case where the productId is not valid
      res.status(404).send('Product not found');
      return;
    }

    const product = await Product.findById(productId);

    // Check if the product is not found
    if (!product) {
      res.status(404).send('Product not found');
      return;
    }

    // Render the product details template (e.g., viewProductDetails.ejs)
    res.render('./admin/modals/viewProductModal', { product, formatNumber });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

