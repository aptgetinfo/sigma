const mongoose = require('mongoose');
const { setLastUpdated } = require('./task.methods');
const { isNameTaken } = require('./task.statics');
const { toJSON, paginate } = require('../plugins');
const { submissionTypes, verificationTypes } = require('../../config/constants');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task Name Required'],
    trim: true,
  },
  mission: {
    type: String,
    required: [true, 'Mission Required'],
  },
  guidelines: [
    {
      type: {
        at: {
          type: Number,
          required: [true, 'Guide Id Required'],
        },
        guide: {
          type: String,
          required: [true, 'Guide Required'],
        },
      },
    },
  ],
  submissionType: [
    {
      type: {
        at: {
          type: Number,
          required: [true, 'Submission Id Required'],
        },
        submission: {
          type: String,
          required: [true, 'Submission Required'],
          enum: submissionTypes,
        },
      },
    },
  ],
  verificationType: [
    {
      type: String,
      required: [true, 'A task must have a verification type'],
      enum: verificationTypes,
    },
  ],
  reward: {
    type: Number,
    default: 10,
    min: [0, 'Reward must be more than 0'],
    required: [true, 'A task must have a reward'],
  },
  taskLevel: {
    type: Number,
    required: [true, 'A task must have a task level'],
    default: 0,
    max: 10,
  },
  conditionLevel: {
    type: Number,
    max: 10,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'A task must belong to a community'],
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

taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);
taskSchema.methods.setLastUpdated = setLastUpdated;
taskSchema.statics.isNameTaken = isNameTaken;
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
