const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js');
const config = require('../config/config');

const isUserInGuild = async (userId, guildId) => {
  const client = new Client({
    fetchAllMembers: true,
    intents: new IntentsBitField(GatewayIntentBits.GUILD_MEMBERS),
  });
  await client.login(config.discord.bot_token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  const member = await guild.members.fetch(userId);
  return userId === member.user.id;
};

const checkInvites = async (guildId, userId, code, numberOfInvites) => {
  const client = new Client({
    intents: new IntentsBitField(GatewayIntentBits.GUILD_MEMBERS),
  });
  await client.login(config.discord.bot_token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  const invites = await guild.invites.fetch();
  const userInvites = invites.filter(
    (invite) => invite.inviterId === userId && invite.code === code && Date.now() - 86400000 < invite.createdTimestamp
  );
  return userInvites.first().uses >= numberOfInvites;
};

const checkRoles = async (guildId, userId, roleRequired) => {
  const client = new Client({
    intents: new IntentsBitField(GatewayIntentBits.GuildMembers),
  });
  await client.login(config.discord.bot_token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  const member = await guild.members.fetch(userId);
  if (!member) return false;
  await guild.roles.fetch();
  const membersRoles = member.roles.cache.map((role) => role.name);
  return membersRoles.includes(roleRequired);
};

const generateInviteLink = async (guildId) => {
  const client = new Client({
    fetchAllMembers: true,
    intents: new IntentsBitField(GatewayIntentBits.GuildMembers),
  });
  await client.login(config.discord.bot_token);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return false;
  const channels = await guild.channels.fetch();
  const channel = channels.filter((c) => c.type === 0).first();
  const invite = await channel.createInvite({
    maxAge: 0,
    maxUses: 0,
    unique: true,
    reason: 'Invite for user',
  });
  return invite.url;
};

module.exports = {
  isUserInGuild,
  checkInvites,
  checkRoles,
  generateInviteLink,
};
