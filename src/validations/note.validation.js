const Joi = require('joi');

const createNoteSchema = Joi.object({
  title: Joi.string().required().max(255),
  content: Joi.string().required()
});

const updateNoteSchema = Joi.object({
  title: Joi.string().max(255),
  content: Joi.string(),
  version: Joi.number().integer().min(1)
}).min(1); // At least one field is required for update

const shareNoteSchema = Joi.object({
  userId: Joi.string().guid({ version: 'uuidv4' }).required()
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  shareNoteSchema
};