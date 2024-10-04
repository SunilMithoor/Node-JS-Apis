const dbConfig = require("../config/dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");
const { logger } = require("../src/libs/logger.js");
const appLogger = logger("Server");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    appLogger.info("Connected..");
  })
  .catch((err) => {
    appLogger.error(`Error: ${err}`);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../src/models/userModel.js")(sequelize, DataTypes);
db.file = require("../src/models/fileModel.js")(sequelize, DataTypes);
db.verify = require("../src/models/verifyModel.js")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    appLogger.info("Yes re-sync done!");
  })
  .catch((err) => {
    appLogger.error("Error" + err);
  });

module.exports = db;
