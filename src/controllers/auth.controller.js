const request = require('request');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, twilioService } = require('../services');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const twitterReverse = catchAsync(async (req, res) => {
  request.post(
    {
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback',
        consumer_key: config.twitter.key,
        consumer_secret: config.twitter.secret,
      },
    },
    (err, r, body) => {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
      }

      const jsonStr = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
      res.status(httpStatus.OK).send(jsonStr);
    }
  );
});

const twitterVerify = catchAsync(async (req, res, next) => {
  request.post(
    {
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: config.twitter.key,
        consumer_secret: config.twitter.secret,
        token: req.query.oauth_token,
      },
      form: { oauth_verifier: req.query.oauth_verifier },
    },
    (err, r, body) => {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
      }

      console.log(body);
      const bodyString = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
      const parsedBody = JSON.parse(bodyString);

      req.body.oauth_token = parsedBody.oauth_token;
      req.body.oauth_token_secret = parsedBody.oauth_token_secret;
      req.body.user_id = parsedBody.user_id;
    }
  );
  next();
});

const login = catchAsync(async (req, res) => {
  const tokens = await tokenService.generateAuthTokens(req.user);
  res.status(httpStatus.CREATED).send({ user: req.user, tokens });
});

// const registerVerification = catchAsync(async (req, res) => {
//   const { email, password, phoneCode, emailCode } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   await authService.verifyEmail(user, emailCode);
//   await authService.verifyPhone(user, phoneCode);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ user, tokens });
// });

// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   // if (type) await twilioService.sendVerificationSms(user.phone);
//   // else await twilioService.sendVerificationEmail(user.email);
//   res.send({ user });
// });

// const loginVerification = catchAsync(async (req, res) => {
//   const { email, password, type, code } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   if (type) await authService.verifyPhone(user, code);
//   else await authService.verifyEmail(user, code);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ user, tokens });
// });

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(httpStatus.NO_CONTENT).send();
// });

const sendVerificationEmail = catchAsync(async (req, res) => {
  await twilioService.sendVerificationEmail(req.user.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationSms = catchAsync(async (req, res) => {
  await twilioService.sendVerificationSms(req.user.phone);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.user, req.code);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifySms = catchAsync(async (req, res) => {
  await authService.verifyPhone(req.user, req.code);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  twitterReverse,
  twitterVerify,
  // register,
  login,
  // registerVerification,
  // loginVerification,
  logout,
  refreshTokens,
  // forgotPassword,
  // resetPassword,
  sendVerificationEmail,
  sendVerificationSms,
  verifyEmail,
  verifySms,
};
