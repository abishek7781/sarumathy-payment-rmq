const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayment,
  refundPayment
} = require('../controllers/paymentController');

router.post('/', createPayment);
router.get('/:id', getPayment);
router.post('/refund/:id', refundPayment);

module.exports = router;