const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.home);
router.get('/admin', userController.admin);
router.get('/admin/management', userController.mngt);
router.get('/admin/add', userController.add);
router.post('/admin/add', userController.postProduct);
router.delete('/edit/:id', userController.deleteStudent);
// router.get('/edit/:id', userController.renderEditProductModal);
// router.post('/edit/:id', userController.editProduct);
router.get('/view/:id', userController.viewProduct);

module.exports = router;