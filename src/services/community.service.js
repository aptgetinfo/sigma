const httpStatus = require('http-status');
const { Community } = require('../models');
const ApiError = require('../utils/ApiError');

const createCommunity = async (communityBody) => {
  if (await Community.isNameTaken(communityBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return Community.create(communityBody);
};

const queryCommunitys = async (filter, options) => {
  const communitys = await Community.paginate(filter, options);
  return communitys;
};

const getCommunityById = async (id) => Community.findById(id);
const getCommunityByName = async (name) => Community.findOne({ name });

const updateCommunityById = async (userId, communityId, updateBody) => {
  const community = await getCommunityById(communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  if (!userId === community.admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this community');
  }
  if (updateBody.name && (await Community.isNameTaken(updateBody.name, communityId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(community, updateBody);
  await community.save();
  return community;
};

const deleteCommunityById = async (userId, communityId) => {
  const community = await getCommunityById(communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  if (!userId === community.admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to delete this community');
  }
  await community.remove();
  return community;
};

module.exports = {
  createCommunity,
  queryCommunitys,
  getCommunityById,
  getCommunityByName,
  updateCommunityById,
  deleteCommunityById,
};
