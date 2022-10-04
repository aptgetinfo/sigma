const httpStatus = require('http-status');
const { Task } = require('../models');
const communityService = require('./community.service');
const ApiError = require('../utils/ApiError');

const createTask = async (taskBody) => {
  const community = await communityService.getCommunityById(taskBody.communityId);
  if (!community) throw new ApiError(httpStatus.BAD_REQUEST, 'Community not found');
  if (await Task.isNameTaken(taskBody.name, taskBody.communityId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task Name already exists');
  return Task.create(taskBody);
};

const queryTasks = async (filter, options) => await Task.paginate(filter, options);
const getTaskById = async (id) => Task.findById(id);

const updateTaskById = async (communityId, taskId, updateBody) => {
  const task = await getTaskById(taskId);
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (task.communityId !== communityId) throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  if (task.isLive && !updateBody.isLive) throw new ApiError(httpStatus.FORBIDDEN, 'Task is live');
  if (updateBody.name && (await Task.isNameTaken(updateBody.name, communityId, taskId)))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task Name already exists');
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

const deleteTaskById = async (communityId, taskId) => {
  const task = await getTaskById(taskId);
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (task.communityId !== communityId) throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  if (task.isLive) throw new ApiError(httpStatus.FORBIDDEN, 'Task is live');
  await task.remove();
  return task;
};
// TODO: check this for improvement
const isOnRequiredLevel = async (tasks, communityId, conditionLevel) => {
  const task = Task.find({ _id: { $in: tasks }, taskLevel: { $gte: conditionLevel }, communityId });
  return !!task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  isOnRequiredLevel,
};
