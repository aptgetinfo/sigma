const mongoose = require('mongoose');
const { setLastUpdated } = require('./community.methods');
const { isNameTaken } = require('./community.statics');
const { toJSON, paginate } = require('../plugins');
const { blockchain } = require('../../config/constants');
const { category } = require('../../config/constants');

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  category: [
    {
      type: String,
      enum: category,
    },
  ],
  image: {
    type: String,
  },
  blockchain: {
    type: String,
    enum: blockchain,
  },
  // totalQuest: {
  //   type: Number,
  //   default: 0,
  // },
  isPublic: {
    type: Boolean,
    default: false,
  },
  twitterProvider: {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    tokenSecret: {
      type: String,
      required: true,
    },
  },
  discordProvider: {
    id: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    permissions: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  twitter: {
    type: String,
  },
  telegram: {
    type: String,
  },
  discord: {
    type: String,
  },
  website: {
    type: String,
  },
  linkedin: {
    type: String,
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
