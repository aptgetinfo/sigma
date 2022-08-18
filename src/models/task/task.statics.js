exports.isNameTaken = async function (name, communityId) {
  const task = await this.findOne({ name, communityId });
  return !!task;
};
