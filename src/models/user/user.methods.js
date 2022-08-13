const bcrypt = require('bcryptjs');

exports.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

exports.setLastUpdated = async function () {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    await this.save();
  }
};
