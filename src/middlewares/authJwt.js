const db = require("../models");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");
const jwt = require("jsonwebtoken");
const user = db.user;
const { logger } = require("../logger/logger.js");
const authLogger = logger("Auth");

const verifyToken = (req, res, next) => {
  try {
    // let token = req.session.token;
    // let token= req.body.token || req.query.token ||
    // req.headers['x-access-token'] || req.headers['auth-token']

    let token = req.header("Authorization");
    authLogger.info(`Token : ${token}`);
    if (!token) {
      authLogger.info("Authorization token is empty");
      return res
        .status(serverCode.unAuthorized)
        .send(
          apiResponse.failureJsonObject(
            res.statusCode,
            false,
            message.access_denied
          )
        );
    }

    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }
    authLogger.info("Verifying token");
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        let errorData = {
          message: err.message,
          expiredAt: err.expiredAt,
        };
        authLogger.error(`Token Error :: ${token}`);
        return res
          .status(serverCode.unAuthorized)
          .send(
            apiResponse.failureJsonObject(
              res.statusCode,
              false,
              message.unAuthorized,
              errorData
            )
          );
      }
      req.user_id = decoded.user_id;
      authLogger.info(`UserId :: ${decoded.user_id}`);
      next();
    });
  } catch (err) {
    authLogger.error("Error :: ", err);
    return res
      .status(serverCode.badRequest)
      .send(
        apiResponse.failureJsonObject(
          res.statusCode,
          false,
          message.invalid_token,
          err
        )
      );
  }
};

module.exports = {
  verifyToken,
};
