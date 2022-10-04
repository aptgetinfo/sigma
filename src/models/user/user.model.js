const mongoose = require('mongoose');
const validator = require('validator');
const { setLastUpdated } = require('./user.methods');
const { isEmailTaken, isPhoneTaken } = require('./user.statics');
const { toJSON, paginate } = require('../plugins');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name Required'],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phone: {
    type: {
      countryCode: {
        type: String,
        required: [true, 'Country Code Required'],
        trim: true,
        lowercase: true,
        validate(value) {
          if (!value.match(/^[0-9]+$/)) {
            throw new Error('Please provide a valid phone number');
          }
        },
      },
      number: {
        type: String,
        required: [true, 'Phone Number Required'],
        trim: true,
        lowercase: true,
        validate(value) {
          if (!value.match(/^[0-9]+$/)) {
            throw new Error('Please provide a valid phone number');
          }
        },
      },
    },
    required: false,
    private: true,
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
    expiresAt: {
      type: Date,
    },
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    trim: true,
  },
  walletAddress: {
    type: String,
    trim: true,
  },
  taskCompleted: [
    {
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
      communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
      },
      submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
      },
      completedAt: {
        type: Date,
      },
      reward: {
        type: Number,
        default: 0,
      },
    },
  ],
  twitter: {
    type: String,
  },
  discord: {
    type: String,
  },
  telegram: {
    type: String,
  },
  website: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
    private: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
    private: true,
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

userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.methods.setLastUpdated = setLastUpdated;
userSchema.statics.isEmailTaken = isEmailTaken;
userSchema.statics.isPhoneTaken = isPhoneTaken;

const User = mongoose.model('User', userSchema);

module.exports = User;
