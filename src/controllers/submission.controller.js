const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { submissionService, transactionService, taskService } = require('../services');
const { submissionType } = require('../config/constants');

const createSubmission = catchAsync(async (req, res) => {
  if (!req.user.isEmailVerified || !req.user.isPhoneVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You need to verify your email or phone number to submit a task');
  }
  const task = await taskService.getTaskById(req.body.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const isAllowed = await taskService.isOnRequiredLevel(
    req.user.taskCompleted.map((a) => a.taskId),
    task.communityId,
    task.conditionLevel
  );
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You need to level up to this task');
  }
  if (task.submissionType === submissionType.None) {
    Object.assign(req.body, { isReviewed: true, isCompleted: true });
  }
  Object.assign(req.body, {
    userId: req.user.id,
    communityId: task.communityId,
    rewardedAmount: task.reward,
  });
  const submission = await submissionService.createSubmission(req.body);
  if (submission.isCompleted && submission.isReviewed) {
    await transactionService.createTransaction(
      submission.userId,
      submission.taskId,
      submission.communityId,
      (submissionId = submission.id) => submissionId,
      (price = submission.rewardedAmount) => price
    );
  }
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
  if (submission.isCompleted && submission.isReviewed) {
    await transactionService.createTransaction(
      submission.userId,
      submission.taskId,
      submission.communityId,
      (submissionId = submission.id) => submissionId,
      (price = submission.rewardedAmount) => price
    );
  }
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
