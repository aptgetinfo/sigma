const httpStatus = require('http-status');
const { Submission } = require('../models');
const ApiError = require('../utils/ApiError');
const communityService = require('./community.service');

const createSubmission = async (submissionBody) => {
  if (await Submission.isTaskDone(submissionBody.taskId, submissionBody.userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task already done');
  }
  Object.assign(submissionBody, { communityId: submissionBody.communityId });
  return Submission.create(submissionBody);
};

const querySubmissions = async (filter, options) => {
  const submissions = await Submission.paginate(filter, options);
  return submissions;
};

const getSubmissionById = async (id) => Submission.findById(id);

const updateSubmissionById = async (userId, submissionId, updateBody) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }
  if (submission.isCompleted && submission.isReviewed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Submission already approved');
  }
  const community = await communityService.getCommunityById(submission.communityId);
  if (userId !== community.admin.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this submission');
  }
  Object.assign(submission, updateBody);
  await submission.save();
  return submission;
};

const deleteSubmissionById = async (userId, submissionId) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }
  const community = await communityService.getCommunityById(submission.communityId);
  if (userId !== community.admin.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to delete this submission');
  }
  await submission.remove();
  return submission;
};

module.exports = {
  createSubmission,
  querySubmissions,
  getSubmissionById,
  updateSubmissionById,
  deleteSubmissionById,
};
