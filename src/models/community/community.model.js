const mongoose = require('mongoose');
const { setLastUpdated } = require('./community.methods');
const { isNameTaken } = require('./community.statics');

const { toJSON, paginate } = require('../plugins');
const { blockchain } = require('../../config/constants');
const { category } = require('../../config/constants');

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community Name Required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description Required'],
  },
  category: [
    {
      type: String,
      enum: category,
      required: [true, 'Category Required'],
    },
  ],
  image: {
    type: String,
    required: [true, 'A community must have a cover image'],
  },
  blockchain: {
    type: String,
    enum: blockchain,
    required: [true, 'A community must have a blockchain'],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A community must have an admin'],
  },
  moderators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  totalQuest: {
    type: Number,
    default: 0,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  twitter: {
    type: String,
    trim: true,
    required: [true, 'Twitter handle is required'],
  },
  telegram: {
    type: String,
    trim: true,
  },
  discord: {
    type: String,
    trim: true,
    required: [true, 'Discord handle is required'],
  },
  website: {
    type: String,
    trim: true,
  },
  opensea: {
    type: String,
    trim: true,
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

communitySchema.plugin(toJSON);
communitySchema.plugin(paginate);
communitySchema.methods.setLastUpdated = setLastUpdated;
communitySchema.statics.isNameTaken = isNameTaken;

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
