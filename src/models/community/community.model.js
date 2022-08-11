const mongoose = require('mongoose');
const { setLastUpdated } = require('./community.methods');
const { toJSON, paginate } = require('../plugins');

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community Name Required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description Required'],
  },
  category: [
    {
      type: String,
      enum: ['Technology', 'Business', 'Politics', 'Health', 'Sports', 'Entertainment', 'Other'],
      required: [true, 'Category Required'],
    },
  ],
  image: {
    type: String,
    required: [true, 'A community must have a cover image'],
  },
  blockchain: {
    type: String,
    enum: ['Ethereum', 'Bitcoin', 'Litecoin', 'Ripple', 'Stellar', 'Ethereum Classic'],
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
  },
  telegram: {
    type: String,
    trim: true,
  },
  discord: {
    type: String,
    trim: true,
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

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
