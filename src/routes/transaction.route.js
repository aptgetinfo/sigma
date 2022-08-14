const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { transactionValidation } = require('../validations');
const { transactionController } = require('../controllers');

const router = express.Router();

router.route('/').get(auth(), validate(transactionValidation.getTransactions), transactionController.getTransactions);

router
  .route('/:transactionId')
  .get(auth(), validate(transactionValidation.getTransaction), transactionController.getTransaction);

module.exports = router;
