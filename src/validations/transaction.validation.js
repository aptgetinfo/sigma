const Joi = require('joi');
const { objectId } = require('./custom.validation');
//TODO add validation to query / parameters
exports.getTransactions = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    taskId: Joi.string().custom(objectId),
    communityId: Joi.string().custom(objectId),
    submissionId: Joi.string().custom(objectId),
    isPaid: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

// exports.deleteTransaction = {
//   params: Joi.object().keys({
//     transactionId: Joi.string().custom(objectId),
//   }),
// };
