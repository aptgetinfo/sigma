const axios = require('axios');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

const config = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
const getUserId = async (username, accessToken) => {
  try {
    const userInfo = await axios
      .get(`https://api.twitter.com/2/users/by/username/${username}`, config(accessToken))
      .then((res) => res.data);
    return userInfo.data.id;
  } catch (err) {
    return err;
  }
};
const navigateTweetsForLikes = async (tweetId, username, accessToken, next) => {
  try {
    const tweetInfo = await axios
      .get(
        `https://api.twitter.com/2/tweets/${tweetId}/liking_users?max_results=100&pagination_token=${next}`,
        config(accessToken)
      )
      .then((res) => res.data);
    const { data, meta } = tweetInfo;
    if (meta.result_count !== 0) {
      const userLikes = data.some((user) => user.username === username);
      if (userLikes) return true;
      return await navigateTweetsForLikes(tweetId, username, meta.next_token);
    }
    return false;
  } catch (err) {
    return err;
  }
};

const navigateTweetsForFollow = async (userId, accountName, accessToken, next, username) => {
  try {
    const getInitialFollowingInfo = await axios
      .get(`https://api.twitter.com/2/users/${userId}/following?pagination_token=${next}`, config(accessToken))
      .then((res) => res.data);

    const { data, meta } = getInitialFollowingInfo;

    if (meta?.next_token) {
      const userFollows = data.some((user) => user.username === accountName);
      if (userFollows) return true;
      return await navigateTweetsForFollow(userId, accountName, meta.next_token, username);
    }
    return false;
  } catch (err) {
    return err;
  }
};

const navigateTweetsForRetweet = async (tweetId, username, accessToken, next) => {
  try {
    const tweetInfo = await axios
      .get(
        `https://api.twitter.com/2/tweets/${tweetId}/retweeted_by?max_results=100&pagination_token=${next}`,
        config(accessToken)
      )
      .then((res) => res.data);
    const { data, meta } = tweetInfo;

    if (meta.result_count !== 0) {
      const userLikes = data.some((user) => user.username === username);
      if (userLikes) return true;
      return await navigateTweetsForRetweet(tweetId, username, meta.next_token);
    }
    return false;
  } catch (err) {
    return err;
  }
};

const checkLike = async (username, tweetId, accessToken) => {
  const getInitialTweetInfo = await axios
    .get(`https://api.twitter.com/2/tweets/${tweetId}/liking_users`, config(accessToken))
    .then((res) => res.data);

  const { data, meta } = getInitialTweetInfo;
  const userLikes = data.some((user) => user.username === username);
  if (!userLikes) return await navigateTweetsForLikes(tweetId, username, meta.next_token);
  return true;
};

const checkFollowing = async (username, accessToken, accountName) => {
  const userId = await getUserId(username, accessToken);

  const getInitialFollowingInfo = await axios
    .get(`https://api.twitter.com/2/users/${userId}/following`, config(accessToken))
    .then((res) => res.data);
  const { data, meta } = getInitialFollowingInfo;
  const userFollows = data.some((user) => user.username === accountName);
  if (!userFollows) return await navigateTweetsForFollow(userId, accountName, meta.next_token, username);
  return true;
};

const checkRetweet = async (username, accessToken, tweetId) => {
  const getInitialTweetInfo = await axios
    .get(`https://api.twitter.com/2/tweets/${tweetId}/retweeted_by`, config(accessToken))
    .then((res) => res.data);

  const { data, meta } = getInitialTweetInfo;
  const userRetweeted = data.some((user) => user.username === username);
  if (!userRetweeted) return await navigateTweetsForRetweet(tweetId, username, meta.next_token);
  return true;
};

const extractInfo = (url) => {
  const regex = /https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)/;
  const match = url.match(regex);
  return {
    username: match[1],
    tweetId: match[2],
  };
};
const checkTweet = async (url, text, accessToken) => {
  const { tweetId } = extractInfo(url);

  const getTweetInfo = await axios
    .get(`https://api.twitter.com/2/tweets/${tweetId}`, config(accessToken))
    .then((res) => res.data);

  const { data } = getTweetInfo;
  if (data.text === text) return true;
  return false;
};

// const createCommunity = async (communityBody) => {
//   if (await Community.isNameTaken(communityBody.name)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
//   }
//   return Community.create(communityBody);
// };

// const queryCommunitys = async (filter, options) => {
//   const communitys = await Community.paginate(filter, options);
//   return communitys;
// };

// const getCommunityById = async (id) => Community.findById(id);
// const getCommunityByName = async (name) => Community.findOne({ name });

// const updateCommunityById = async (userId, communityId, updateBody, file) => {
//   const community = await getCommunityById(communityId);
//   if (!community) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
//   }
//   if (userId !== community.admin.toString()) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this community');
//   }
//   if (updateBody.name && (await Community.isNameTaken(updateBody.name, communityId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
//   }
//   Object.assign(community, updateBody);
//   if (file) Object.assign(updateBody, { image: file.filename });
//   await community.save();
//   return community;
// };

// const deleteCommunityById = async (userId, communityId) => {
//   const community = await getCommunityById(communityId);
//   if (!community) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Community not found');
//   }
//   if (userId !== community.admin.toString()) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to delete this community');
//   }
//   await community.remove();
//   return community;
// };

module.exports = {
  checkLike,
  checkFollowing,
  checkRetweet,
  checkTweet,
};
