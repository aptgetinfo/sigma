const axios = require('axios');
const config = require('../config/config');

const header = {
  headers: {
    Authorization: `Bearer ${config.twitter.bearer}`,
  },
};
const getUserId = async (username) => {
  try {
    const userInfo = await axios
      .get(`https://api.twitter.com/2/users/by/username/${username}`, header)
      .then((res) => res.data);
    return userInfo.data.id;
  } catch (err) {
    return err;
  }
};

const getTweetId = async (url) => {
  try {
    const tweetInfo = await axios
      .get(`https://api.twitter.com/2/tweets?ids=${url.split('/').pop()}`, header)
      .then((res) => res.data);
    return tweetInfo.data[0].id;
  } catch (err) {
    return err;
  }
};
const navigateTweetsForLikes = async (tweetId, username, next) => {
  try {
    const tweetInfo = await axios
      .get(`https://api.twitter.com/2/tweets/${tweetId}/liking_users?max_results=100&pagination_token=${next}`, header)
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

const navigateTweetsForFollow = async (userId, accountName, next, username) => {
  try {
    const getInitialFollowingInfo = await axios
      .get(`https://api.twitter.com/2/users/${userId}/following?pagination_token=${next}`, header)
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

const navigateTweetsForRetweet = async (tweetId, username, next) => {
  try {
    const tweetInfo = await axios
      .get(`https://api.twitter.com/2/tweets/${tweetId}/retweeted_by?max_results=100&pagination_token=${next}`, header)
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

const checkLike = async (username, tweetId) => {
  const getInitialTweetInfo = await axios
    .get(`https://api.twitter.com/2/tweets/${tweetId}/liking_users`, header)
    .then((res) => res.data);

  const { data, meta } = getInitialTweetInfo;
  const userLikes = data.some((user) => user.username === username);
  if (!userLikes) return await navigateTweetsForLikes(tweetId, username, meta.next_token);
  return true;
};

const checkFollowing = async (username, accountName) => {
  const userId = await getUserId(username, config.twitter.bearer);

  const getInitialFollowingInfo = await axios
    .get(`https://api.twitter.com/2/users/${userId}/following`, header)
    .then((res) => res.data);
  const { data, meta } = getInitialFollowingInfo;
  const userFollows = data.some((user) => user.username === accountName);
  if (!userFollows) return await navigateTweetsForFollow(userId, accountName, meta.next_token, username);
  return true;
};

const checkRetweet = async (username, tweetId) => {
  const getInitialTweetInfo = await axios
    .get(`https://api.twitter.com/2/tweets/${tweetId}/retweeted_by`, header)
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
const checkTweet = async (url, text) => {
  const { tweetId } = extractInfo(url);

  const getTweetInfo = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}`, header).then((res) => res.data);
  // TODO: add check if same user has tweeted or not
  const { data } = getTweetInfo;
  if (data.text === text) return true;
  // TODO: user regex to match tweet if quote retweet is the task
  return false;
};

module.exports = {
  checkLike,
  checkFollowing,
  checkRetweet,
  checkTweet,
  getTweetId,
};
