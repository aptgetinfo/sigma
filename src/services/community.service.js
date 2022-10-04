const httpStatus = require('http-status');
const { Community } = require('../models');
const ApiError = require('../utils/ApiError');

const queryCommunitys = async (filter, options) => await Community.paginate(filter, options);
const getCommunityById = async (id) => Community.findById(id);

const updateCommunityById = async (communityId, updateBody, file) => {
  const community = await getCommunityById(communityId);
  if (!community) throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  // TODO: check if below if/else is working as intended, in task also.
  if (community.isPublic && !updateBody.isPublic) throw new ApiError(httpStatus.FORBIDDEN, 'Community is Public');
  if (updateBody.name && (await Community.isNameTaken(updateBody.name, communityId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(community, updateBody);
  if (file) Object.assign(updateBody, { image: file.filename });
  await community.save();
  return community;
};

const deleteCommunityById = async (communityId) => {
  const community = await getCommunityById(communityId);
  if (!community) throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  if (community.isPublic) throw new ApiError(httpStatus.FORBIDDEN, 'Community is Public');
  await community.remove();
  return community;
};

module.exports = {
  queryCommunitys,
  getCommunityById,
  updateCommunityById,
  deleteCommunityById,
};
