const { logger } = require("../logger/logger.js");
const utilLogger = logger("DateTimeUtils");

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
    utilLogger.info(`datetime  :: ${dateTime}`);
    return dateTime;
  } catch (err) {
    utilLogger.error(`error  :: ${err}`);
    return "";
  }
}

module.exports = {
  giveCurrentDateTime,
};
