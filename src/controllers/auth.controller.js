const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, twilioService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  await twilioService.sendVerificationSms(user.phone);
  await twilioService.sendVerificationEmail(user.email);
  res.status(httpStatus.CREATED).send({ user });
});

const registerVerification = catchAsync(async (req, res) => {
  const { email, password, phoneCode, emailCode } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  await authService.verifyEmail(user, emailCode);
  await authService.verifyPhone(user, phoneCode);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password, type } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (type) await twilioService.sendVerificationSms(user.phone);
  else await twilioService.sendVerificationEmail(user.email);
  res.send({ user });
});

const loginVerification = catchAsync(async (req, res) => {
  const { email, password, type, code } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (type) await authService.verifySms(user, code);
  else await authService.verifyEmail(user, code);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  await twilioService.sendVerificationEmail(req.user.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationSms = catchAsync(async (req, res) => {
  await twilioService.sendVerificationSms(req.user.phone);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.user, req.code);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifySms = catchAsync(async (req, res) => {
  await authService.verifyPhone(req.user, req.code);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  registerVerification,
  loginVerification,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  sendVerificationSms,
  verifyEmail,
  verifySms,
};
