const httpStatus = require('http-status');
const { Task } = require('../models');
const communityService = require('./community.service');
const ApiError = require('../utils/ApiError');

const createTask = async (taskBody) => {
  const community = await communityService.getCommunityById(taskBody.communityId);
  if (!community) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Community not found');
  }
  if (community.admin !== taskBody.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to create a task');
  }
  return Task.create(taskBody);
};

const queryTasks = async (filter, options) => {
  const tasks = await Task.paginate(filter, options);
  return tasks;
};

const getTaskById = async (id) => Task.findById(id);

const updateTaskById = async (userId, taskId, updateBody) => {
  //TODO Name chaek for duplicate task name
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const community = await communityService.getCommunityById(task.communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  if (userId !== community.admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this community');
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

const deleteTaskById = async (userId, taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const community = await communityService.getCommunityById(task.communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  if (userId !== community.admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this community');
  }
  await task.remove();
  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
