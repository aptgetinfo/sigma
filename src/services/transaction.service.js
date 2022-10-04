const httpStatus = require('http-status');
const { Transaction } = require('../models');
const ApiError = require('../utils/ApiError');

const createTransaction = async (transactionBody) => {
  if (await Transaction.isTransactionDone(transactionBody.submissionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transcation already exists');
  }
  return Transaction.create(transactionBody);
};

const queryTransactions = async (filter, options) => await Transaction.paginate(filter, options);
const getTransactionById = async (id) => Transaction.findById(id);

// const updateTransactionById = async (transactionId, updateBody) => {
//   const transaction = await getTransactionById(transactionId);
//   if (!transaction) throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
//   Object.assign(transaction, updateBody);
//   await transaction.save();
//   return transaction;
// };

// const deleteTransactionById = async (communityId, transactionId) => {
//   const transaction = await getTransactionById(transactionId);
//   if (!transaction) throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
//   if (transaction.communityId !== communityId)
//     throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this community');
//   await transaction.remove();
//   return transaction;
// };

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  // updateTransactionById,
  // deleteTransactionById,
};
