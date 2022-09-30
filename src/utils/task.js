const { verificationTypes, submissionTypes } = require('../config/constants');

exports.tasks = {
  0: {
    name: 'Follow Twitter',
    mission: 'Follow us on twitter',
    guide: {
      0: ' Click on the given link and follow our page',
    },
    submissions: {
      0: submissionTypes.None,
    },
    taskLevel: 0,
    condition: null,
    verificationType: [verificationTypes.Twitter_Follow],
  },
  1: {
    name: 'Join Discord',
    mission: 'Join our Discord server',
    guide: {
      0: ' Click on the given link and join our server',
    },
    submissions: {
      0: submissionTypes.None,
    },
    taskLevel: 0,
    condition: null,
    verificationType: [verificationTypes.Discord_Join],
  },
  2: {
    name: 'Join Telegram',
    mission: 'Join our telegram community and announcement channel.',
    guide: {
      0: ' Click on the given link and join our group',
    },
    submissions: {
      0: submissionTypes.None,
    },
    taskLevel: 0,
    condition: null,
    verificationType: [verificationTypes.Telegram_Join],
  },
  3: {
    name: 'Whitepaper Task',
    mission: 'Read the white paper and write a Twitter thread about the project.',
    guide: {
      0: 'Click on the given link and read the whitepaper',
      1: 'Click on the twitter link and create a thread of the project whitepaper, tag the project handle along with it',
    },
    submission: {
      0: submissionTypes.Twitter_Link,
    },
    taskLevel: 1,
    condition: 0,
    verification: [verificationTypes.Twitter_Follow, verificationTypes.Manual],
  },
  4: {
    name: ' Quote and Retweet',
    mission: 'Quote and retweet this Twitter post',
    guide: {
      0: 'Click on the given link, Quote and Retweet the post',
    },
    submission: {
      0: submissionTypes.Twitter_Link,
    },
    taskLevel: 1,
    condition: 0,
    verification: [verificationTypes.Twitter_Follow, verificationTypes.Twitter_Quote_Retweet],
  },
  5: {
    name: 'Like and Retweet',
    mission: 'Like and retweet this Twitter post',
    guide: {
      0: 'Click on the given link, Like and Retweet the post',
    },
    submission: {
      0: submissionTypes.Twitter_Link,
    },
    taskLevel: 1,
    condition: 0,
    verification: [verificationTypes.Twitter_Follow, verificationTypes.Twitter_Like, verificationTypes.Twitter_Retweet],
  },
  6: {
    name: 'Discord Activity.',
    mission:
      'Verify Yourself, Claim a Role, Introduce Yourself, Send memes, Explain the use-case of the project, Join events if any.',
    guide: {
      0: 'Go to the #verify channel and verify yourself.',
      1: 'Go to the #roles channel and claim a role.',
      2: 'Go to the #into channel and write a small description about yourself, including background, role, web3 experience and twitter profile link.',
      3: 'Go to #memes channel and send some of your favourite web3/defi/crypto memes and interact with other memes.',
      4: 'In the general channel write a few lines on what you understand about the project including a use case you believe would become very prominent.',
      5: 'Look for any upcoming events in the upcoming channels, if any register for the same and send a message in the general chat saying you would be attending it.',
    },
    submission: {
      0: submissionTypes.None,
    },
    taskLevel: 1,
    condition: 1,
    verification: [verificationTypes.Discord_Join, verificationTypes.Discord_Role, verificationTypes.Manual],
  },
  7: {
    name: 'Discord Invite',
    mission: 'Invite at least 3 people to Join discord server',
    guide: {
      0: 'Go to the discord server, click on invite people, get the invite link and make 3 people to join the discord server.',
    },
    submission: {
      0: submissionTypes.Discord_Link,
    },
    taskLevel: 1,
    condition: 1,
    verification: [verificationTypes.Discord_Join, verificationTypes.Discord_Invite],
  },

  8: {
    name: 'Telegram Questionnaire',
    mission: 'Ask 3 contextual questions about the project in telegram community',
    guide: {
      0: 'Join both of our groups and ask 3 questions related to the project in the community group.Right click the message you sent and click on Copy Message Link.',
    },
    submission: {
      0: submissionTypes.Telegram_Link,
    },
    taskLevel: 1,
    condition: 2,
    verification: [verificationTypes.Telegram_Join, verificationTypes.Manual],
  },

  9: {
    name: 'Meme Fest',
    mission: 'Create 10 memes using the template provided',
    guide: {
      0: 'With the resources provided create 10 memes, make a drive link and store them in a public folder.',
    },
    submission: {
      0: submissionTypes.Drive_Link,
    },
    taskLevel: 2,
    condition: null,
    verification: [verificationTypes.Manual],
  },
  10: {
    name: 'Social Memes',
    mission: 'Post "X" memes on “Twitter/Telegram/Discord” Server',
    submission: {
      0: submissionTypes.Twitter_Link,
      1: submissionTypes.Telegram_Link,
      2: submissionTypes.Discord_Link,
    },
    taskLevel: 2,
    condition: null,
    verification: [
      verificationTypes.Twitter_Follow,
      verificationTypes.Telegram_Join,
      verificationTypes.Discord_Join,
      verificationTypes.Manual,
    ],
  },
};
