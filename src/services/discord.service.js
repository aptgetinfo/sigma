const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js');

const isUserInGuild = (guildId, userId, token) => {
  const client = new Client({
    intents: new IntentsBitField(GatewayIntentBits.GUILD_MEMBERS),
  });
  client.login(token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  return guild.member(userId);
};

const checkInvites = async (guildId, userId, token) => {
  const client = new Client({
    intents: new IntentsBitField(GatewayIntentBits.GUILD_MEMBERS),
  });
  client.login(token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  const invites = await guild.fetchInvites();
  const userInvites = invites.filter((invite) => invite.inviter.id === userId);
  return userInvites.size > 0;
};

const checkRoles = async (guildId, userId, token, roles) => {
  const client = new Client({
    intents: new IntentsBitField(GatewayIntentBits.GUILD_MEMBERS),
  });
  client.login(token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  const member = guild.member(userId);
  if (!member) return false;
  const userRoles = member.roles.cache.map((role) => role.name);
  return roles.some((role) => userRoles.includes(role));
};

module.exports = {
  isUserInGuild,
  checkInvites,
  checkRoles,
};
