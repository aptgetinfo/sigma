const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { communityService } = require('../services');

const createCommunity = catchAsync(async (req, res) => {
  Object.assign(req.body, { admin: req.user.id });
  const community = await communityService.createCommunity(req.body);
  res.status(httpStatus.CREATED).send(community);
});

const getCommunitys = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category', 'blockchain']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await communityService.queryCommunitys(filter, options);
  res.send(result);
});

const getCommunity = catchAsync(async (req, res) => {
  const community = await communityService.getCommunityById(req.params.communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  res.send(community);
});

const updateCommunity = catchAsync(async (req, res) => {
  const community = await communityService.updateCommunityById(req.user.id, req.params.communityId, req.body, req.file);
  res.send(community);
});

const deleteCommunity = catchAsync(async (req, res) => {
  await communityService.deleteCommunityById(req.user.id, req.params.communityId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCommunity,
  getCommunitys,
  getCommunity,
  updateCommunity,
  deleteCommunity,
};
