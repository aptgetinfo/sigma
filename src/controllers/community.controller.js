const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { communityService } = require('../services');

const getCommunitys = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category', 'blockchain', 'isPublic']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await communityService.queryCommunitys(filter, options);
  res.send(result);
});

const getCommunity = catchAsync(async (req, res) => {
  const community = await communityService.getCommunityById(req.params.communityId);
  if (!community) throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  res.send(community);
});

const updateCommunity = catchAsync(async (req, res) => {
  const community = await communityService.updateCommunityById(req.community.id, req.body, req.file);
  res.send(community);
});

const deleteCommunity = catchAsync(async (req, res) => {
  await communityService.deleteCommunityById(req.community.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getCommunitys,
  getCommunity,
  updateCommunity,
  deleteCommunity,
};
