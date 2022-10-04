const axios = require('axios');
const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const communityService = require('./community.service');
const twilioService = require('./twillo.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/constants');
const config = require('../config/config');

const loginWithDiscord = async (code, bot = false) => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', bot ? config.discord.bot_client_id : config.discord.client_id);
    params.append('grant_type', 'authorization_code');
    params.append('client_secret', bot ? config.discord.bot_client_secret : config.discord.client_secret);
    params.append('code', code);
    params.append('redirect_uri', bot ? config.discord.bot_redirect_uri : config.discord.redirect_uri);

    const { data } = await axios.post(config.discord.access_token_url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Discord Login Error');
  }
};
const discordRefreshAccessToken = async (refreshToken, bot = false) => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', bot ? config.discord.bot_client_id : config.discord.client_id);
    params.append('grant_type', 'refresh_token');
    params.append('client_secret', bot ? config.discord.bot_client_secret : config.discord.client_secret);
    params.append('refresh_token', refreshToken);
    params.append('redirect_uri', bot ? config.discord.bot_redirect_uri : config.discord.redirect_uri);
    const { data } = await axios.post(config.discord.access_token_url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Discord Login Error');
  }
};
const getUserDiscordProfile = async (accessToken) => {
  try {
    const { data } = await axios.get(config.discord.user_profile_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      userId: data.id,
      username: data.username,
      avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : null,
      email: data.email,
      isVerified: data.verified,
      discriminator: data.discriminator,
    };
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Discord Profile Not Found');
  }
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    let doc = await userService.getUserById(refreshTokenDoc.doc);
    doc ??= await communityService.getCommunityById(refreshTokenDoc.doc);
    if (!doc) throw new Error();
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(doc);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const verifyEmail = async (user, code) => {
  try {
    const verified = await twilioService.verifyEmail(user.email, code);
    if (!verified) throw new Error();
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const verifyPhone = async (user, code) => {
  try {
    const verified = await twilioService.verifyPhone(user.phone, code);
    if (!verified) throw new Error();
    await userService.updateUserById(user.id, { isPhoneVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Phone verification failed');
  }
};

module.exports = {
  logout,
  refreshAuth,
  verifyEmail,
  verifyPhone,
  loginWithDiscord,
  discordRefreshAccessToken,
  getUserDiscordProfile,
};
