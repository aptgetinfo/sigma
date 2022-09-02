const express = require('express');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { communityValidation } = require('../validations');
const { communityController } = require('../controllers');
const { multerService } = require('../services');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(communityValidation.createCommunity), communityController.createCommunity)
  .get(validate(communityValidation.getCommunitys), communityController.getCommunitys);

router
  .route('/:communityId')
  .get(validate(communityValidation.getCommunity), communityController.getCommunity)
  .patch(
    auth(),
    validate(communityValidation.updateCommunity),
    multerService.uploadImage,
    multerService.resizeCommunityImage,
    communityController.updateCommunity
  )
  .delete(auth(), validate(communityValidation.deleteCommunity), communityController.deleteCommunity);

module.exports = router;
