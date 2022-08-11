exports.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  if (user.isEmailVerified === false) {
    await user.remove();
    return false;
  }
  return !!user;
};

exports.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  if (user.isPhoneVerified === false) {
    await user.remove();
    return false;
  }
  return !!user;
};
