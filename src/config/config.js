const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    TWILIO_ACCOUNT_SID: Joi.string().required().description('Twilio Account SID'),
    TWILIO_AUTH_TOKEN: Joi.string().required().description('Twilio Auth Token'),
    TWILIO_SERVICE_SID: Joi.string().required().description('Twilio Service SID'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(300).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(300).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    DISCORD_CLIENT_ID: Joi.string().required().description('Discord Client ID'),
    DISCORD_CLIENT_SECRET: Joi.string().required().description('Discord Client Secret'),
    DISCORD_REDIRECT_URI: Joi.string().required().description('Discord Redirect URI'),
    DISCORD_ACCESS_TOKEN_URL: Joi.string().required().description('Discord Access Token URL'),
    DISCORD_USER_PROFILE_URL: Joi.string().required().description('Discord User Profile URL'),
    DISCORD_BOT_CLIENT_ID: Joi.string().required().description('Discord Bot Client Secret'),
    DISCORD_BOT_CLIENT_SECRET: Joi.string().required().description('Discord Bot Client Secret'),
    DISCORD_BOT_REDIRECT_URI: Joi.string().required().description('Discord Bot Redirect URI'),
    DISCORD_BOT_TOKEN: Joi.string().required().description('Discord Bot Token'),
    TWITTER_API_KEY: Joi.string().required().description('Twitter API Key'),
    TWITTER_API_KEY_SECRET: Joi.string().required().description('Twitter API Secret'),
    TWITTER_BEARER_TOKEN: Joi.string().required().description('Twitter Bearer Token'),
    TWITTER_COMMUNITY_API_KEY: Joi.string().required().description('Twitter Community API Key'),
    TWITTER_COMMUNITY_API_KEY_SECRET: Joi.string().required().description('Twitter Community API Secret'),
    TWITTER_COMMUNITY_BEARER_TOKEN: Joi.string().required().description('Twitter Community Bearer Token'),
    TELEGRAM_BOT_TOKEN: Joi.string().required().description('Telegram Bot Token'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  twilio: {
    account_sid: envVars.TWILIO_ACCOUNT_SID,
    auth_token: envVars.TWILIO_AUTH_TOKEN,
    service_sid: envVars.TWILIO_SERVICE_SID,
  },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  twitter: {
    key: envVars.TWITTER_API_KEY,
    secret: envVars.TWITTER_API_KEY_SECRET,
    bearer: envVars.TWITTER_BEARER_TOKEN,
    community: {
      key: envVars.TWITTER_COMMUNITY_API_KEY,
      secret: envVars.TWITTER_COMMUNITY_API_KEY_SECRET,
      bearer: envVars.TWITTER_COMMUNITY_BEARER_TOKEN,
    },
  },
  discord: {
    client_id: envVars.DISCORD_CLIENT_ID,
    client_secret: envVars.DISCORD_CLIENT_SECRET,
    redirect_uri: envVars.DISCORD_REDIRECT_URI,
    access_token_url: envVars.DISCORD_ACCESS_TOKEN_URL,
    user_profile_url: envVars.DISCORD_USER_PROFILE_URL,
    bot_client_id: envVars.DISCORD_BOT_CLIENT_ID,
    bot_client_secret: envVars.DISCORD_BOT_CLIENT_SECRET,
    bot_redirect_uri: envVars.DISCORD_BOT_REDIRECT_URI,
    bot_token: envVars.DISCORD_BOT_TOKEN,
  },
  telegram: {
    bot_token: envVars.TELEGRAM_BOT_TOKEN,
  },
};
