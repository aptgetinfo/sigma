const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { getOtp, matchOtp, isPasswordMatch } = require('./user.methods');
const { isEmailTaken, isPhoneTaken } = require('./user.statics');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');

const userSchema = mongoose.Schema(
  {
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
      type: String,
      required: [true, 'Phone Number Required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!value.match('[0-9]{10}')) {
          throw new Error('Please provide a valid phone number');
        }
      },
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
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

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
userSchema.methods.getOtp = getOtp;
userSchema.methods.matchOtp = matchOtp;
userSchema.methods.isPasswordMatch = isPasswordMatch;
userSchema.statics.isEmailTaken = isEmailTaken;
userSchema.statics.isPhoneTaken = isPhoneTaken;

const User = mongoose.model('User', userSchema);

module.exports = User;
