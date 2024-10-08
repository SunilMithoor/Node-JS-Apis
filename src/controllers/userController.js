const db = require("../../models/index.js");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");
// npm install bcrypt // install package for encrypt data
const { genSaltSync, hashSync } = require("bcrypt");
const bcrypt = require("bcryptjs");
//npm i jsonwebtoken // install package for jsonwebtoken
const jwt = require("jsonwebtoken");
const { logger } = require("../libs/logger.js");
const userLogger = logger("User");
const moment = require('moment');
const date = new Date();

// create main Model
const User = db.user;

// main work

// 1. create user

const addUser = async (req, res) => {
  userLogger.info(`addUser request :: ${req.body}`);
  const checkUser = await User.findOne({
    where: { userName: req.body.userName },
  });
  if (checkUser && checkUser.dataValues) {
    return res
      .status(serverCode.conflict)
      .send(
        apiResponse.failureJsonObject(
          res.statusCode,
          false,
          message.user_exists
        )
      );
  } else {
    const salt = genSaltSync(10);
    var password = hashSync(req.body.password, salt);
    let info = {
      userName: req.body.userName,
      password: password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fcmToken: req.body.fcmToken,
      dateOfBirth: req.body.dateOfBirth ? req.body.dateOfBirth : null,
    };

    const user = await User.create(info)
      .then((data) => {
        if (data) {
          const token = jwt.sign(
            { userId: data.userId, userName: data.userName },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: process.env.JWT_EXPIRE,
              algorithm: process.env.JWT_ALGORITHM,
            }
          );
          return res
            .status(serverCode.created)
            .send(
              apiResponse.successJsonObject(
                res.statusCode,
                true,
                message.success,
                token
              )
            );
        } else {
          return res
            .status(serverCode.notFound)
            .send(
              apiResponse.failureJsonObject(
                res.statusCode,
                false,
                message.un_success
              )
            );
        }
      })
      .catch((err) => {
        userLogger.error(`error  :: ${err}`);
        return res
          .status(serverCode.notFound)
          .send(
            apiResponse.serverErrorJsonObject(
              res.statusCode,
              false,
              message.server_error
            )
          );
      });
  }
};

// 2. get all users

const getAllUsers = async (req, res) => {
  userLogger.info("getAllUsers request :: ");
  let users = await User.findAll({})
    .then((data) => {
      return res
        .status(serverCode.ok)
        .send(
          apiResponse.successJsonObject(
            res.statusCode,
            true,
            message.success,
            data
          )
        );
    })
    .catch((err) => {
      userLogger.error(`error  :: ${err}`);
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.server_error
          )
        );
    });
};

// 3. get users by id

const getUserById = async (req, res) => {
  userLogger.info(`getUserById request :: ${req.userId}`);
  let users = await User.findOne({ where: { userId: req.userId } })
    .then((data) => {
      if (data) {
        return res
          .status(serverCode.ok)
          .send(
            apiResponse.successJsonObject(
              res.statusCode,
              true,
              message.success,
              data
            )
          );
      } else {
        return res
          .status(serverCode.notFound)
          .send(
            apiResponse.failureJsonObject(
              res.statusCode,
              false,
              message.user_not_found
            )
          );
      }
    })
    .catch((err) => {
      userLogger.error(`error  :: ${err}`);
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.server_error
          )
        );
    });
};

// 4. delete user
const deleteUser = async (req, res) => {
  userLogger.info(`deleteUser request :: ${req.userId}`);
  let users = await User.destroy({ where: { userId: req.userId } })
    .then((data) => {
      if (data) {
        return res
          .status(serverCode.ok)
          .send(
            apiResponse.successJsonObject(
              res.statusCode,
              true,
              message.success,
              data
            )
          );
      } else {
        return res
          .status(serverCode.notFound)
          .send(
            apiResponse.failureJsonObject(
              res.statusCode,
              false,
              message.user_not_found
            )
          );
      }
    })
    .catch((err) => {
      userLogger.error(`error  :: ${err}`);
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.server_error
          )
        );
    });
};

// 5. update user
const updateUser = async (req, res) => {
  userLogger.info(`updateUser request :: ${req.body}`);
  let info = {
    userName: req.body.userName,
    password: password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fcmToken: req.body.fcmToken,
    dateOfBirth: req.body.dateOfBirth ? req.body.dateOfBirth : null,
  };
  let users = await User.updateUser({ where: { userId: id } })
    .then((data) => {
      if (data) {
        return res
          .status(serverCode.ok)
          .send(
            apiResponse.successJsonObject(
              res.statusCode,
              true,
              message.success,
              data
            )
          );
      } else {
        return res
          .status(serverCode.notFound)
          .send(
            apiResponse.failureJsonObject(
              res.statusCode,
              false,
              message.user_not_found
            )
          );
      }
    })
    .catch((err) => {
      userLogger.error(`error  :: ${err}`);
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.server_error
          )
        );
    });
};

// 6. login user
const loginUser = async (req, res) => {
  userLogger.info(`loginUser request :: ${req.body}`);
  try {
    let info = {
      userName: req.body.userName,
      password: req.body.password,
    };
    const user = await User.findOne({
      where: { userName: req.body.userName },
    });
    if (!user) {
      userLogger.error("User not found");
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.failureJsonObject(
            res.statusCode,
            false,
            message.user_not_found
          )
        );
    }
    userLogger.info(`user :: ${user}`);
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      userLogger.error("Invalid password");
      return res
        .status(serverCode.unAuthorized)
        .send(
          apiResponse.failureJsonObject(
            res.statusCode,
            false,
            message.invalid_password
          )
        );
    }
    const token = jwt.sign(
      { userId: user.userId, userName: user.userName },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE,
        algorithm: process.env.JWT_ALGORITHM,
      }
    );
    // req.session.token = token;
    userLogger.info(`token :: ${token}`);
    // var data = {
    //     user_data: user,
    //     token: token
    // };
    return res
      .status(serverCode.ok)
      .send(
        apiResponse.successJsonObject(
          res.statusCode,
          true,
          message.logged_in,
          token
        )
      );
  } catch (err) {
    userLogger.error(`error  :: ${err}`);
    res
      .status(serverCode.notFound)
      .send(
        apiResponse.serverErrorJsonObject(res.statusCode,false, message.server_error)
      );
  }
};

// 7. logout user
const logoutUser = async (req, res) => {
  userLogger.info(`logoutUser request :: ${req.body}`);
  try {
    // req.session = null;
    return res
      .status(serverCode.ok)
      .send(
        apiResponse.successJsonObject(
          res.statusCode,
          true,
          message.logged_out,
          null
        )
      );
  } catch (err) {
    userLogger.error(`error  :: ${err}`);
    res
      .status(serverCode.notFound)
      .send(
        apiResponse.serverErrorJsonObject(res.statusCode,false, message.server_error)
      );
  }
};

// 8. get user data

const getUserData = async (req, res) => {
  userLogger.info(`getUserData request :: ${req.params}`);
  await User.findOne({ where: { userId: req.userId } })
    .then((data) => {
      if (data) {
        return res
          .status(serverCode.ok)
          .send(
            apiResponse.successJsonObject(
              res.statusCode,
              true,
              message.success,
              data
            )
          );
      } else {
        return res
          .status(serverCode.notFound)
          .send(
            apiResponse.failureJsonObject(
              res.statusCode,
              false,
              message.user_not_found
            )
          );
      }
    })
    .catch((err) => {
      userLogger.error(`error  :: ${err}`);
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.server_error
          )
        );
    });
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  loginUser,
  logoutUser,
  getUserData,
};
