const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');

exports.getOtp = function () {
  const otpSecret = speakeasy.generateSecret();
  this.temp_secret = otpSecret.base32;
  return speakeasy.totp({
    secret: this.temp_secret,
    encoding: 'base32',
  });
};

exports.matchOtp = async function (otp) {
  return await speakeasy.totp.verify({
    secret: this.temp_secret,
    encoding: 'base32',
    token: otp,
    window: 10,
  });
};

exports.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
