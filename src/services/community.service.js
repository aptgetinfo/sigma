const httpStatus = require('http-status');
const { Community } = require('../models');
const ApiError = require('../utils/ApiError');

const createCommunity = async (communityBody) => Community.create(communityBody);

const queryCommunitys = async (filter, options) => {
  const communitys = await Community.paginate(filter, options);
  return communitys;
};

const getCommunityById = async (id) => Community.findById(id);

const updateCommunityById = async (communityId, updateBody) => {
  const community = await getCommunityById(communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  Object.assign(community, updateBody);
  await community.save();
  return community;
};

const deleteCommunityById = async (communityId) => {
  const community = await getCommunityById(communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  await community.remove();
  return community;
};

module.exports = {
  createCommunity,
  queryCommunitys,
  getCommunityById,
  updateCommunityById,
  deleteCommunityById,
};
