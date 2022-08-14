exports.isTaskDone = async function (taskId, userId, excludeUserId) {
  const community = await this.findOne({ taskId, userId, _id: { $ne: excludeUserId } });
  return !!community;
};
