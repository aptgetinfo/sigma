const mongoose = require('mongoose');
const { setLastUpdated } = require('./task.methods');
const { toJSON, paginate } = require('../plugins');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task Name Required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'A task must have a cover image'],
  },
  totalQuest: {
    type: Number,
    default: 0,
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
