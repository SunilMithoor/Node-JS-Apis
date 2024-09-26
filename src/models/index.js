const dbConfig = require("../configs/dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");
const { logger } = require("../logger/logger.js");
const serverLogger = logger("Server");

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
    serverLogger.info("Connected..");
  })
  .catch((err) => {
    serverLogger.error(`Error: ${err}`);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, DataTypes);
db.images = require("./imagesModel.js")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    serverLogger.info("Yes re-sync done!");
  })
  .catch((err) => {
    serverLogger.error("Error" + err);
  });

module.exports = db;
