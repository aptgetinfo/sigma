const mongoose = require('mongoose');
const { setLastUpdated } = require('./submission.methods');
const { isTaskDone } = require('./submission.statics');
const { toJSON, paginate } = require('../plugins');

const submissionSchema = mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isReviewed: {
    type: Boolean,
    default: false,
  },
  entry: {
    type: String,
    required: true,
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

submissionSchema.plugin(toJSON);
submissionSchema.plugin(paginate);
submissionSchema.methods.setLastUpdated = setLastUpdated;
submissionSchema.statics.isTaskDone = isTaskDone;

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
