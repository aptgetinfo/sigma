const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { userValidation } = require('../validations');
const { userController } = require('../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), userController.deleteUser);

module.exports = router;
