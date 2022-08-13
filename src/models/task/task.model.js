const mongoose = require('mongoose');
const { setLastUpdated } = require('./task.methods');
const { toJSON, paginate } = require('../plugins');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task Name Required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A task must have a description'],
  },
  price: {
    type: Number,
    required: [true, 'A task must have a price'],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  submissionType: {
    type: String,
    required: [true, 'A task must have a submission type'],
    enum: {
      values: ['url', 'image', 'text', 'home', 'twitter', 'join discord'],
      message: 'Submission type must be either: url, image, text, home, twitter, or join discord',
    },
  },
  recurrence: {
    type: String,
    required: [true, 'A task must have a recurrence'],
    enum: {
      values: ['once', 'daily', 'weekly', 'monthly'],
      message: 'Recurrence must be either: once, daily, weekly or monthly',
    },
  },
  rewards: {
    type: Number,
    default: 100,
    required: [true, 'A task must have a reward'],
  },
  condition: {
    type: String,
    enum: {
      values: ['quest', 'level', 'date', 'discord role', 'max claims', 'invitees'],
      message: 'Condition must be either: quest, level, date, discord role, max claims, or invitees',
    },
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

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
