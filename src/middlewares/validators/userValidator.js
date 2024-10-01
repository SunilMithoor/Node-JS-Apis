const Joi = require("joi");

// const loginSchema = Joi.object({
//   userName: Joi.string().required(),
//   password: Joi.string().required(),
// });

const loginSchema = Joi.object({
  userName: Joi.string().required().min(3).messages({
    "string.empty": "Please enter username",
    "string.min": "Please enter 3 chars",
  }),
  password: Joi.string()
    .required()
    .min(3)
    .messages({ "string.empty": "Please enter password" }),
});

const addUserSchema = Joi.object({
  userName: Joi.string().min(4).required(),
  password: Joi.string().min(4).required(),
});

module.exports = {
  loginSchema,
  addUserSchema,
};
