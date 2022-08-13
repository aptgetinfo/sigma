const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { isPasswordMatch, setLastUpdated } = require('./user.methods');
const { isEmailTaken, isPhoneTaken } = require('./user.statics');
const { toJSON, paginate } = require('../plugins');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name Required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email Required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phone: {
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
  description: {
    type: String,
  },
  image: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password Required'],
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
    private: true,
  },
  walletAddress: {
    type: String,
    trim: true,
  },
  twitter: {
    type: String,
    trim: true,
  },
  discord: {
    type: String,
    trim: true,
  },
  telegram: {
    type: String,
    trim: true,
  },
  website: {
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
      completedAt: {
        type: Date,
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reward: {
        type: Number,
        default: 0,
      },
    },
  ],
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
  isActive: {
    type: Boolean,
    default: true,
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

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
userSchema.methods.setLastUpdated = setLastUpdated;
userSchema.methods.isPasswordMatch = isPasswordMatch;
userSchema.statics.isEmailTaken = isEmailTaken;
userSchema.statics.isPhoneTaken = isPhoneTaken;

const User = mongoose.model('User', userSchema);

module.exports = User;
