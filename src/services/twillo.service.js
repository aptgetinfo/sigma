const Twilio = require('twilio');
// const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const client = new Twilio(config.twilio.account_sid, config.twilio.auth_token).verify.v2.services(config.twilio.service_sid);

exports.sendVerificationSms = async (phone) => {
  try {
    await client.verifications.create({
      to: `+${phone.countryCode}${phone.phoneNumber}`,
      channel: 'sms',
    });
  } catch (err) {
    throw new ApiError(err.status, err.message);
  }
};

exports.sendVerificationEmail = async (email) => {
  try {
    await client.verifications.create({
      to: email,
      channel: 'email',
    });
  } catch (err) {
    throw new ApiError(err.status, err.message);
  }
};

exports.verifySms = async (phone, code) => {
  const verification = await client.verificationChecks.create({ to: `+${phone.countryCode}${phone.phoneNumber}`, code });
  return verification.status === 'approved';
};

exports.verifyEmail = async (email, code) => {
  const verification = await client.verificationChecks.create({ to: email, code });
  return verification.status === 'approved';
};
