const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const twilioService = require('./twillo.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/constants');

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
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const verifyEmail = async (user, code) => {
  try {
    const verified = await twilioService.verifyEmail(user.email, code);
    if (!verified) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const verifyPhone = async (user, code) => {
  try {
    const verified = await twilioService.verifyPhone(user.phone, code);
    if (!verified) {
      throw new Error();
    }
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
};
