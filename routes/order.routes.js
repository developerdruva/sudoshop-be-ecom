var express = require('express');
var router = express.Router();

var orderController = require('../controllers/order.controller');

router.post('/neworder', orderController.newOrder);
router.get('/ordersin', orderController.ordersIn);
router.get('/orderbyuser/:userId', orderController.ordersByUser);

module.exports = router;

