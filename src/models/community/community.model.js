const mongoose = require('mongoose');
const { setLastUpdated } = require('./community.methods');
const { toJSON, paginate } = require('../plugins');

const communitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Community Name Required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'A community must have a cover image'],
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
  },
  {
    timestamps: true,
  }
);

communitySchema.plugin(toJSON);
communitySchema.plugin(paginate);
communitySchema.methods.setLastUpdated = setLastUpdated;

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
