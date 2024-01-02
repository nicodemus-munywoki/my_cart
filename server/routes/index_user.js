const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.home);
router.get('/admin', userController.admin);
router.get('/admin/management', userController.mngt);
router.get('/admin/add', userController.add);
router.post('/admin/add', userController.postProduct);
// router.post('/checkout', userController.payment);
// router.get('/test', userController.uTest);
router.delete('/edit/:id', userController.deleteStudent);
router.get('/add-to-cart/:id', userController.addToCart);
router.get('/shopping-cart', userController.cart);
router.get('/confirm', userController.checkOut);
router.get('/view/:id', userController.viewProduct);

module.exports = router;