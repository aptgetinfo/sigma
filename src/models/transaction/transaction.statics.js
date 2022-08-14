exports.isTranscationDone = async function (submissionId, excludeUserId) {
  const transaction = await this.findOne({ submissionId, _id: { $ne: excludeUserId } });
  return !!transaction;
};
