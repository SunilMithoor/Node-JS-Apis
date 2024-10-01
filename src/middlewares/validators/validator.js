const Validators = require("../validators/mainValidator.js");
const message = require("../../constants/message.js");
const lodash = require("lodash");

module.exports = function (validator) {
  // Split the validator key into parts if nested
  const [validatorGroup, validatorSchema] = validator.split(".");

  // Ensure the group and schema exist
  if (
    !Object.prototype.hasOwnProperty.call(Validators, validatorGroup) ||
    !Object.prototype.hasOwnProperty.call(
      Validators[validatorGroup],
      validatorSchema
    )
  ) {
    throw new Error(`'${validator}' validator does not exist`);
  }

  // Access the correct schema
  const schema = Validators[validatorGroup][validatorSchema];

  return async function (req, res, next) {
    try {
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false,
      }); // abortEarly: false to capture all errors
      req.body = validated;
      next();
    } catch (err) {
      console.log(" Validators error: ", err);
      if (err.isJoi) {
        // Create an array of error messages
        // const errorMessages = err.details.map((detail) => ({
        //   field: detail.path.join("."), // The field (path) with the error, e.g., "userName"
        //   message: detail.message.replace(/["]/g, ""), // The error message, clean up quotes
        //   type: detail.type, // The type of validation error, e.g., "string.empty"
        // }));

        // // Log the errors for debugging
        // console.error("Validators error: ", errorMessages);

        // const errorMessages = err.details.map((detail) => ({
        //   message: detail.message.replace(/["]/g, ""), // The error message, clean up quotes
        // }));
        // console.error("Validators error messages: ", errorMessages);

        // return res.status(422).json(errorMessages);

        // Extract and join error messages
        const errorMessages = err.details.map((detail) =>
          detail.message.replace(/["]/g, "")
        ); // Clean up quotes
        const joinedMessages = lodash.join(errorMessages, ", "); // Join messages with a comma

        // Send response in the desired format
        return res.status(422).json({
          statusCode: 422,
          success: false,
          message: joinedMessages,
        });
      }
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: message.check_input_data,
      });
    }
  };
};
