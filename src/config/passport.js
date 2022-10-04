const TwitterTokenStrategy = require('passport-twitter-token');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const httpStatus = require('http-status');
const { User, Community } = require('../models');
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
const twitterOptionsCommunity = {
  consumerKey: config.twitter.community.key,
  consumerSecret: config.twitter.community.secret,
  includeEmail: true,
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      const community = await Community.findById(payload.sub);
      if (!community) {
        return done(null, false);
      }
      return done(null, community);
    }
    return done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const twitterVerifyForUser = async (token, tokenSecret, profile, done) => {
  try {
    const community = await Community.findOne({
      'twitterProvider.id': profile.id,
    });
    if (community) throw new ApiError(httpStatus.BAD_REQUEST, 'Twitter already taken');
    const user = await User.findOne({
      'twitterProvider.id': profile.id,
    });
    if (!user) {
      const newUser = await User.create({
        name: profile.username,
        image: profile.photos[0].value,
        twitter: profile.username,
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

const twitterVerifyForCommunity = async (token, tokenSecret, profile, done) => {
  try {
    const user = await User.findOne({
      'twitterProvider.id': profile.id,
    });
    if (user) throw new ApiError(httpStatus.BAD_REQUEST, 'Twitter already taken');
    const community = await Community.findOne({
      'twitterProvider.id': profile.id,
    });
    if (!community) {
      const newCommunity = await Community.create({
        name: profile.username,
        image: profile.photos[0].value,
        twitter: profile.username,
        twitterProvider: {
          id: profile.id,
          token: token,
          tokenSecret: tokenSecret,
        },
      });
      done(null, newCommunity);
    }
    done(null, community);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
const twitterStrategyForUser = new TwitterTokenStrategy(twitterOptions, twitterVerifyForUser);
const twitterStrategyForCommunity = new TwitterTokenStrategy(twitterOptionsCommunity, twitterVerifyForCommunity);

module.exports = {
  twitterStrategyForUser,
  twitterStrategyForCommunity,
  jwtStrategy,
};
