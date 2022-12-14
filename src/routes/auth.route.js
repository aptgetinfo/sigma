const express = require('express');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');
const { authController } = require('../controllers');
const { auth, authTwitter, authTwitter2 } = require('../middlewares/auth');

const router = express.Router();
router.get(
  '/user/twitter',
  validate(authValidation.twitterVerify),
  authController.twitterVerify,
  authTwitter(),
  authController.login
);
router.get(
  '/community/twitter',
  validate(authValidation.twitterVerify),
  authController.twitterVerifyCommunity,
  authTwitter2(),
  authController.loginCommunity
);
router.get('/discord', validate(authValidation.discordLogin), authController.discordLogin);
router.get('/discord-bot', validate(authValidation.discordBotLogin), authController.discordBotLogin);
router.post('/user/twitter/reverse', authController.twitterReverse);
router.post('/community/twitter/reverse', authController.twitterReverseCommunity);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/send-verification-sms', auth(), authController.sendVerificationSms);
router.post('/verify-email', auth(), validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/verify-sms', auth(), validate(authValidation.verifySms), authController.verifySms);

module.exports = router;
// TODO: if user image doesnt sets using twitter then set it to discord images
