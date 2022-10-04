const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { submissionService, transactionService, taskService } = require('../services');
const { submissionType, verificationTypes } = require('../config/constants');

const createSubmission = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.body.taskId);
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (!task.isLive) throw new ApiError(httpStatus.FORBIDDEN, 'Task not found');
  const isAllowed = await taskService.isOnRequiredLevel(
    req.user.taskCompleted.map((a) => a.taskId),
    task.communityId,
    task.conditionLevel
  );
  if (!isAllowed) throw new ApiError(httpStatus.FORBIDDEN, 'You need to level up to this task');
  const isTaskCompleted = await submissionService.isTaskCompleted(req.user, task, req.body);
  if (!isTaskCompleted) throw new ApiError(httpStatus.FORBIDDEN, 'Task not completed');
  if (!task.verificationType.includes(verificationTypes.Manual)) {
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
      (reward = submission.rewardedAmount) => reward
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
  if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  res.send(submission);
});

const updateSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.updateSubmissionById(req.community.id, req.params.submissionId, req.body);
  if (submission.isCompleted && submission.isReviewed) {
    await transactionService.createTransaction(
      submission.userId,
      submission.taskId,
      submission.communityId,
      (submissionId = submission.id) => submissionId,
      (reward = submission.rewardedAmount) => reward
    );
  }
  res.send(submission);
});
// TODO: add task to user array
// TODO: add check for submission type
const deleteSubmission = catchAsync(async (req, res) => {
  await submissionService.deleteSubmissionById(req.community.id, req.params.submissionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
