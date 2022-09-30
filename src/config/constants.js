exports.blockchain = {
  None: 'none',
  Ethereum: 'ethereum',
  Polygon: 'polygon',
  Tezos: 'tezos',
  Avalanche: 'avalanche',
  Fantom: 'fantom',
  Binance_Smart_Chain: 'binance-smart-chain',
  Solana: 'solana',
  Arweave: 'arweave',
  Cardano: 'cardano',
  Flow: 'flow',
  Starknet: 'starknet',
  Juno: 'juno',
  Cosmos: 'cosmos',
  Hedera: 'hedera',
  Teal: 'teal',
};

exports.verificationTypes = {
  Manual: 0,
  Twitter_Follow: 1,
  Twitter_Retweet: 2,
  Twitter_Like: 3,
  Twitter_Quote_Retweet: 4,
  Discord_Join: 5,
  Discord_Role: 6,
  Discord_Invite: 7,
  Telegram_Join: 8,
};

exports.submissionTypes = {
  None: 0,
  Twitter_Link: 1,
  Discord_Link: 2,
  Telegram_Link: 3,
  Drive_Link: 4,
};
exports.category = {
  Nft: 'nft',
  Dao: 'dao',
  Art: 'art',
  Music: 'music',
  Collectibles: 'collectibles',
  Gaming: 'gaming',
  Defi: 'defi',
  Metaverse: 'metaverse',
  Trading_Cards: 'trading-cards',
  Infrastructure: 'infrastructure',
  Education: 'education',
  Startup: 'startup',
  Protocol: 'protocol',
  Investing: 'investing',
};

exports.submissionType = {
  None: 'none',
  Url: 'url',
  Image: 'image',
  Text: 'text',
  Twitter: 'twitter',
  Discord: 'discord',
};

exports.tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
  VERIFY_OTP: 'verifyOTP',
};

const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const jobs = {
  discord: ['join'],
  twitter: ['follow', 'retweet'],
  telegram: ['join'],
};
exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));

exports.job = Object.keys(jobs);
exports.jobTypes = new Map(Object.entries(jobs));
