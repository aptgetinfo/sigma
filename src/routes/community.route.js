const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const communityValidation = require('../validations/community.validation');
const communityController = require('../controllers/community.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCommunitys'), validate(communityValidation.createCommunity), communityController.createCommunity)
  .get(auth('getCommunitys'), validate(communityValidation.getCommunitys), communityController.getCommunitys);

router
  .route('/:communityId')
  .get(auth('getCommunitys'), validate(communityValidation.getCommunity), communityController.getCommunity)
  .patch(auth('manageCommunitys'), validate(communityValidation.updateCommunity), communityController.updateCommunity)
  .delete(auth('manageCommunitys'), validate(communityValidation.deleteCommunity), communityController.deleteCommunity);

module.exports = router;
