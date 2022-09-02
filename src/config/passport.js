const TwitterTokenStrategy = require('passport-twitter-token');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const httpStatus = require('http-status');
const { User } = require('../models');
const config = require('./config');
const { tokenTypes } = require('./constants');
const ApiError = require('../utils/ApiError');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const twitterOptions = {
  consumerKey: config.twitter.key,
  consumerSecret: config.twitter.secret,
  includeEmail: true,
};
const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const twitterVerify = async (token, tokenSecret, profile, done) => {
  try {
    const user = await User.findOne({
      'twitterProvider.id': profile.id,
    });
    if (!user) {
      if (await User.isEmailTaken(profile.emails[0].value)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
      }
      const newUser = await User.create({
        email: profile.emails[0].value,
        twitterProvider: {
          id: profile.id,
          token: token,
          tokenSecret: tokenSecret,
        },
      });
      done(null, newUser);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
const twitterStrategy = new TwitterTokenStrategy(twitterOptions, twitterVerify);

module.exports = {
  twitterStrategy,
  jwtStrategy,
};
