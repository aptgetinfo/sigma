const mongoose = require('mongoose');
const { setLastUpdated } = require('./transaction.methods');
const { toJSON, paginate } = require('../plugins');
const { isTranscationDone } = require('./transaction.statics');

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
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidOn: {
    type: Date,
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
transactionSchema.statics.isTranscationDone = isTranscationDone;

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
