const httpStatus = require('http-status');
const { Transaction } = require('../models');
const communityService = require('./community.service');
const ApiError = require('../utils/ApiError');

const createTransaction = async (transactionBody) => {
  if (await Transaction.isTransactionDone(transactionBody.submissionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transcation already exists');
  }
  return Transaction.create(transactionBody);
};

const queryTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

const getTransactionById = async (id) => Transaction.findById(id);

const updateTransactionById = async (transactionId, updateBody) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  Object.assign(transaction, updateBody);
  await transaction.save();
  return transaction;
};

const deleteTransactionById = async (userId, transactionId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  const community = await communityService.getCommunityById(transaction.communityId);
  if (!community) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
  }
  if (userId !== community.admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this community');
  }
  await transaction.remove();
  return transaction;
};

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
};
