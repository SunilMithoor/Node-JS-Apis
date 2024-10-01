const { logger } = require("../libs/logger.js");
const appLogger = logger("DateTimeUtils");

function giveCurrentDateTime() {
  var dateTime = "";
  try {
    const today = new Date();
    const date =
      today.getFullYear() +
      "_" +
      (today.getMonth() + 1) +
      "_" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + "_" + time;
    appLogger.info(`datetime  :: ${dateTime}`);
    return dateTime;
  } catch (err) {
    appLogger.error(`error  :: ${err}`);
    return "";
  }
}

module.exports = {
  giveCurrentDateTime,
};
