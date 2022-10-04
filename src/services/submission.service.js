/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const { Submission } = require('../models');
const ApiError = require('../utils/ApiError');
const communityService = require('./community.service');
const twitterService = require('./twitter.service');
const discordService = require('./discord.service');
const { verificationTypes, submissionTypes } = require('../config/constants');

const createSubmission = async (submissionBody) => {
  if (await Submission.isTaskDone(submissionBody.taskId, submissionBody.userId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task already done');
  Object.assign(submissionBody, { communityId: submissionBody.communityId });
  return Submission.create(submissionBody);
};

const querySubmissions = async (filter, options) => await Submission.paginate(filter, options);
const getSubmissionById = async (id) => Submission.findById(id);

const updateSubmissionById = async (communityId, submissionId, updateBody) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  if (submission.communityId !== communityId)
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this submission');
  if (submission.isCompleted && submission.isReviewed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Submission already approved');
  }
  Object.assign(submission, updateBody);
  await submission.save();
  return submission;
};

const deleteSubmissionById = async (communityId, submissionId) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  if (submission.communityId !== communityId)
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this submission');
  if (submission.isCompleted && submission.isReviewed)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Submission already approved');
  await submission.remove();
  return submission;
};

const isTaskCompleted = async (user, task, submission) => {
  const community = await communityService.getCommunityById(task.communityId);
  if (!community) throw new ApiError(httpStatus.FORBIDDEN, 'No community found');
  for await (const verificationType of task.verificationType) {
    if (verificationType === verificationTypes.Twitter_Follow) {
      const isFollowing = await twitterService.checkFollowing(user.twitter, community.twitter, user.twitterProvider.token);
      if (!isFollowing) return false;
    }
    if (verificationType === verificationTypes.Discord_Join) {
      const hasJoined = await discordService.isUserInGuild(
        user.discordProvider.id,
        community.discordProvider.id,
        community.discordProvider.accessToken
      );
      if (!hasJoined) return false;
    }
    if (verificationType === verificationTypes.Twitter_Like) {
      const isLiked = await twitterService.checkLike(user.twitter, task.entry.info, user.twitterProvider.token);
      if (!isLiked) return false;
    }
    if (verificationType === verificationTypes.Twitter_Retweet) {
      const isRetweeted = await twitterService.checkRetweet(user.twitter, submission.entry.info, user.twitterProvider.token);
      if (!isRetweeted) return false;
    }
    if (verificationType === verificationTypes.Twitter_Quote_Retweet) {
      if (submission.type === submissionTypes.Twitter_Link) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Twitter link not submitted');
      }
      const isTweeted = await twitterService.checkTweet(
        submission.entry.info,
        task.submission.info,
        user.twitterProvider.token
      );
      if (!isTweeted) return false;
    }
    if (verificationType === verificationTypes.Discord_Invite) {
      const isInvited = await discordService.checkInvites(
        community.discordProvider.id,
        user.discordProvider.id,
        task.submission.info,
        community.discordProvider.accessToken
      );
      if (!isInvited) return false;
    }
    if (verificationType === verificationTypes.Discord_Role) {
      const hasRole = await discordService.checkRoles(
        community.discordProvider.id,
        user.discordProvider.id,
        task.submission.info,
        community.discordProvider.accessToken
      );
      if (!hasRole) return false;
    }
    if (verificationType === verificationTypes.Telegram_Join) {
      // TODO: Add Telegram verification
    }
    if (verificationType === verificationTypes.Manual) {
      // TODO: Add Manual verification
    }
  }
  return true;
};

module.exports = {
  createSubmission,
  querySubmissions,
  getSubmissionById,
  updateSubmissionById,
  deleteSubmissionById,
  isTaskCompleted,
};
