exports.isNameTaken = async function (name, excludeUserId) {
  const community = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!community;
};
