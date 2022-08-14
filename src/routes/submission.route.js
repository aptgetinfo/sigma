const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { submissionValidation } = require('../validations');
const { submissionController } = require('../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(submissionValidation.createSubmission), submissionController.createSubmission)
  .get(auth(), validate(submissionValidation.getSubmissions), submissionController.getSubmissions);

router
  .route('/:submissionId')
  .get(auth(), validate(submissionValidation.getSubmission), submissionController.getSubmission)
  .patch(auth(), validate(submissionValidation.updateSubmission), submissionController.updateSubmission)
  .delete(auth(), validate(submissionValidation.deleteSubmission), submissionController.deleteSubmission);

module.exports = router;
