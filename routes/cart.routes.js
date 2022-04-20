var express = require('express');
var router = express.Router();

var cartCotroller = require('../controllers/cart.controller');

router.post('/addcart',cartCotroller.addCart);
router.get('/getcart', cartCotroller.getCart);
router.get('/getusercart/:userId', cartCotroller.getUserCart);
router.delete('/deleteusercart/:userId', cartCotroller.deleteUserCart);
router.post('/increaseitem', cartCotroller.increaseItem);
router.post('/decreaseitem', cartCotroller.decreaseItem);

module.exports = router; 