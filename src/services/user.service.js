const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const queryUsers = async (filter, options) => await User.paginate(filter, options);
const getUserById = async (id) => User.findById(id);
const getUserByEmail = async (email) => User.findOne({ email });
const getUserByPhone = async (phone) => User.findOne({ phone });

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.phone && (await User.isPhoneTaken(updateBody.phone, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (updateBody.email) Object.assign(updateBody, { isEmailVerified: false });
  if (updateBody.phone) Object.assign(updateBody, { isPhoneVerified: false });
  // if (file) Object.assign(updateBody, { image: file.filename });
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  await user.remove();
  return user;
};

module.exports = {
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserById,
  deleteUserById,
};
