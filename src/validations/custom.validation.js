exports.objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

exports.password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

//TODO Phone Number Validation
exports.phoneNumber = (value, helpers) => {
  if (!value.match('[0-9]{10}')) {
    return helpers.message('Please provide a valid phone number');
  }
  return value;
};

exports.isTwitterProfileLink = (value, helpers) => {
  if (!value.match(/^https:\/\/twitter\.com\/[a-zA-Z0-9_]+$/)) {
    return helpers.message('Please provide a valid twitter profile link');
  }
  return value;
};

exports.isTelegramProfileLink = (value, helpers) => {
  if (!value.match(/^https:\/\/telegram\.me\/[a-zA-Z0-9_]+$/)) {
    return helpers.message('Please provide a valid telegram profile link');
  }
  return value;
};

exports.isDiscordProfileLink = (value, helpers) => {
  if (!value.match(/^https:\/\/discord\.gg\/[a-zA-Z0-9_]+$/)) {
    return helpers.message('Please provide a valid discord profile link');
  }
  return value;
};
