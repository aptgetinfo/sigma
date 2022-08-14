const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { submissionService } = require('../services');

const createSubmission = catchAsync(async (req, res) => {
  Object.assign(req.body, { userId: req.user.id });
  const submission = await submissionService.createSubmission(req.body);
  res.status(httpStatus.CREATED).send(submission);
});

const getSubmissions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['taskId', 'communityId', 'userId', 'isCompleted', 'isReviewed']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await submissionService.querySubmissions(filter, options);
  res.send(result);
});

const getSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.getSubmissionById(req.params.submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }
  res.send(submission);
});

const updateSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.updateSubmissionById(req.user.id, req.params.submissionId, req.body, req.file);
  res.send(submission);
});

const deleteSubmission = catchAsync(async (req, res) => {
  await submissionService.deleteSubmissionById(req.user.id, req.params.submissionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
