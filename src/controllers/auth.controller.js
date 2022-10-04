/* eslint-disable no-nested-ternary */
const request = require('request');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, twilioService, userService, communityService } = require('../services');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/constants');

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
      res.status(httpStatus.OK).send(JSON.parse(jsonStr));
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
      const bodyString = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
      if (!bodyString.match('.*\\boauth_token_secret\\b.*')) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Twitter authentication failed');
      }
      const parsedBody = JSON.parse(bodyString);
      req.body.oauth_token = parsedBody.oauth_token;
      req.body.oauth_token_secret = parsedBody.oauth_token_secret;
      req.body.user_id = parsedBody.user_id;
      next();
    }
  );
});
const twitterReverseCommunity = catchAsync(async (req, res) => {
  request.post(
    {
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback',
        consumer_key: config.twitter.community.key,
        consumer_secret: config.twitter.community.secret,
      },
    },
    (err, r, body) => {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
      }
      const jsonStr = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
      res.status(httpStatus.OK).send(JSON.parse(jsonStr));
    }
  );
});

const twitterVerifyCommunity = catchAsync(async (req, res, next) => {
  request.post(
    {
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: config.twitter.community.key,
        consumer_secret: config.twitter.community.secret,
        token: req.query.oauth_token,
      },
      form: { oauth_verifier: req.query.oauth_verifier },
    },
    (err, r, body) => {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
      }
      const bodyString = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
      if (!bodyString.match('.*\\boauth_token_secret\\b.*')) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Twitter authentication failed');
      }
      const parsedBody = JSON.parse(bodyString);
      req.body.oauth_token = parsedBody.oauth_token;
      req.body.oauth_token_secret = parsedBody.oauth_token_secret;
      req.body.user_id = parsedBody.user_id;
      next();
    }
  );
});

const discordLogin = catchAsync(async (req, res) => {
  const { code, state } = req.query;
  const doc = await tokenService.verifyToken(state, tokenTypes.REFRESH);
  const userData = await userService.getUserById(doc.user);
  const data = !userData.discordProvider.expiresAt
    ? await authService.loginWithDiscord(code)
    : userData.discordProvider.expiresAt < Date.now()
    ? await authService.discordRefreshAccessToken(userData.discordProvider.refreshToken)
    : { access_token: userData.discordProvider.accessToken, refresh_token: userData.discordProvider.refreshToken };
  const user = await authService.getUserDiscordProfile(data.access_token);
  const updatedUser = await userService.updateUserById(doc.user, {
    discordProvider: {
      id: user.userId,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    discord: `${user.username}#${user.discriminator}`,
  });
  res.status(httpStatus.OK).send(updatedUser);
});

const discordBotLogin = catchAsync(async (req, res) => {
  const { code, permissions, state } = req.query;
  const doc = await tokenService.verifyToken(state, tokenTypes.REFRESH);
  const communityData = await communityService.getCommunityById(doc.user);
  const data = !communityData.discordProvider.expiresAt
    ? await authService.loginWithDiscord(code, true)
    : communityData.discordProvider.expiresAt < Date.now()
    ? await authService.discordRefreshAccessToken(communityData.discordProvider.refreshToken, true)
    : { access_token: communityData.discordProvider.accessToken, refresh_token: communityData.discordProvider.refreshToken };
  const updatedCommunity = await communityService.updateCommunityById(doc.user, {
    discordProvider: {
      id: data.guild.id,
      username: data.guild.name,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      permissions: permissions,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    discord: data.guild.name,
  });
  res.status(httpStatus.OK).send(updatedCommunity);
});

const login = catchAsync(async (req, res) => {
  const tokens = await tokenService.generateAuthTokens(req.user);
  res.status(httpStatus.CREATED).send({ user: req.user, tokens });
});

const loginCommunity = catchAsync(async (req, res) => {
  const tokens = await tokenService.generateAuthTokens(req.community);
  res.status(httpStatus.CREATED).send({ community: req.community, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  await twilioService.sendVerificationEmail(req.user.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationSms = catchAsync(async (req, res) => {
  await twilioService.sendVerificationSms(req.user.phone);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.user, req.body.code);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifySms = catchAsync(async (req, res) => {
  await authService.verifyPhone(req.user, req.body.code);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  twitterReverse,
  twitterVerify,
  twitterReverseCommunity,
  twitterVerifyCommunity,
  discordLogin,
  discordBotLogin,
  login,
  loginCommunity,
  logout,
  refreshTokens,
  sendVerificationEmail,
  sendVerificationSms,
  verifyEmail,
  verifySms,
};
