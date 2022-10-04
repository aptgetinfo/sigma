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
  reward: {
    type: Number,
    min: [0, 'Transaction Price must be >= 0'],
    default: 0,
    required: [true, 'A transaction must consist a price'],
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
// TODO add Last updated call to every schema update

transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);
transactionSchema.methods.setLastUpdated = setLastUpdated;
transactionSchema.statics.isTranscationDone = isTranscationDone;

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
