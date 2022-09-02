const express = require('express');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');
const { authController } = require('../controllers');
const { auth, authTwitter } = require('../middlewares/auth');

const router = express.Router();

router.post('/twitter/reverse', authController.twitterReverse);
router.post(
  '/twitter',
  validate(authValidation.twitterVerify),
  authController.twitterVerify,
  authTwitter(),
  authController.login
);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/send-verification-sms', auth(), authController.sendVerificationSms);
router.post('/verify-email', auth(), validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/verify-sms', auth(), validate(authValidation.verifySms), authController.verifySms);

module.exports = router;
