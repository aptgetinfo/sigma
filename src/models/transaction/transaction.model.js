const mongoose = require('mongoose');
const { setLastUpdated } = require('./transaction.methods');
const { toJSON, paginate } = require('../plugins');

const transactionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidOn: {
    type: Date,
    default: new Date(),
  },
  dateOfEntry: {
    type: Date,
    default: new Date(),
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
  },
});

transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);
transactionSchema.methods.setLastUpdated = setLastUpdated;

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
