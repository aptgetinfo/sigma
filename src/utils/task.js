const { verificationTypes } = require('../config/constants');

exports.tasks = {
  1: {
    name: 'Follow Twitter',
    mission: 'Follow us on twitter',
    guide: {
      1: ' Click on the given link and follow our page',
    },
    submissions: null,
    taskLevel: 0,
    condition: 0,
    verificationType: verificationTypes.Bot,
  },
  2: {
    name: 'join Telegram',
    mission: 'Join our Telegram group',
    guide: {
      1: ' Click on the given link and join our group',
    },
    submissions: null,
    taskLevel: 0,
    condition: 0,
    verificationType: verificationTypes.Bot,
  },
  3: {
    name: 'Join Discord',
    mission: 'Join our Discord server',
    guide: {
      1: ' Click on the given link and join our server',
    },
    submissions: null,
    taskLevel: 0,
    condition: 0,
    verificationType: verificationTypes.Bot,
  },
  4: {
    name: 'Whitepaper Task',
    mission: 'Read the white paper and write a Twitter thread about the project.',
    guide: {
      1: 'Click on the given link and read the whitepaper, then click on the twitter link and create a thread of the project whitepaper, then click on the twitter link and create a thread of the project whitepaper.',
    },
    submission: 'Submit the link of the twitter thread.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Manual,
  },
  5: {
    name: 'Telegram Questionnaire',
    mission: 'Ask 3 contextual questions about the project in telegram community',
    guide: {
      1: 'Join both of our groups and ask 3 questions related to the project in the community group.Right click the message you sent and click on Copy Message Link.',
    },
    submission: 'Submit your username and Submit the link of the questions you asked.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Manual,
  },
  6: {
    name: 'Discord Activity.',
    mission:
      'Verify Yourself, Claim a Role, Introduce Yourself, Send memes, Explain the use-case of the project, Join events if any.',
    guide: {
      1: 'Go to the #verify channel and verify yourself.',
      2: 'Go to the #roles channel and claim a role.',
      3: 'Go to the #into channel and write a small description about yourself, including background, role, web3 experience and twitter profile link.',
      4: 'Go to #memes channel and send some of your favourite web3/defi/crypto memes and interact with other memes.',
      5: 'In the general channel write a few lines on what you understand about the project including a use case you believe would become very prominent.',
      6: 'Look for any upcoming events in the upcoming channels, if any register for the same and send a message in the general chat saying you would be attending it.',
    },
    submission: 'Submit your discord username.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Manual,
  },
  7: {
    name: 'Discord Invite',
    mission: 'Invite at least 3 people to Join discord server',
    guide: {
      1: 'Go to the discord server, click on invite people, get the invite link and make 3 people to join the discord server.',
    },
    submission: 'Submit the invite link.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Bot,
  },
  8: {
    name: ' Quote and Retweet',
    mission: 'Quote and retweet this Twitter post',
    guide: {
      1: 'Click on the given link, Quote and Retweet the post',
    },
    submission: 'Submit the link of the retweet.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Bot,
  },
  9: {
    name: 'Like and Retweet',
    mission: 'Like and retweet this Twitter post',
    guide: {
      1: 'Click on the given link, Like and Retweet the post',
    },
    submission: 'Submit the link of the retweet.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Bot,
  },
  10: {
    name: 'Meme Fest',
    mission: 'Create 10 memes using the template provided',
    guide: {
      1: 'With the resources provided create 10 memes, make a drive link and store them in a public folder.',
    },
    submission: 'Submit the link of the drive folder.',
    taskLevel: 0,
    condition: 0,
    verification: verificationTypes.Manual,
  },
  11: {
    name: 'Social Memes',
    mission: 'Post "X" memes on “Twitter/Telegram/Discord” Server',
    submission: 'Submit the link of the post.',
    taskLevel: 1,
    condition: 1,
    verification: verificationTypes.Manual,
  },
};
