const axios = require('axios');
const config = require('../config/config');

const checkIfUserInChat = async (chatId, userId) => {
  const chatInfo = await axios
    .get(`https://api.telegram.org/bot${config.telegram.bot_token}/getChatMember?chat_id=${chatId}&user_id=${userId}`)
    .then((res) => res.data);
  if (chatInfo.ok) {
    return (
      chatInfo.result.status === 'member' ||
      chatInfo.result.status === 'creator' ||
      chatInfo.result.status === 'administrator'
    );
  }
  return false;
};

const checkIfChatIsPrivate = async (chatId) => {
  const chatInfo = await axios
    .get(`https://api.telegram.org/bot${config.telegram.bot_token}/getChat?chat_id=${chatId}`)
    .then((res) => res.data);
  if (chatInfo.ok) {
    return chatInfo.result.type === 'private';
  }
  return false;
};

const checkIfUserIsAdmin = async (chatId, userId) => {
  const chatInfo = await axios
    .get(`https://api.telegram.org/bot${config.telegram.bot_token}/getChatMember?chat_id=${chatId}&user_id=${userId}`)
    .then((res) => res.data);
  if (chatInfo.ok) {
    return chatInfo.result.status === 'creator' || chatInfo.result.status === 'administrator';
  }
  return false;
};

module.exports = {
  checkIfUserInChat,
  checkIfChatIsPrivate,
  checkIfUserIsAdmin,
};
