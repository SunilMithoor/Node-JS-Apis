const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

// Custom printf format that includes the label (category)
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create logger function with category labels
const logger = (category) => {
  return winston.createLogger({
    level: "debug",
    format: combine(
      label({ label: category }), // Attach category label
      timestamp(),
      customFormat
    ),
    // transports: [new winston.transports.Console()],
    transports: [
      // new winston.transports.File({
      //   filename: "logs/app.log",
      // }),
      new winston.transports.File({
        level: "error",
        filename: "logs/error.log",
      }),
      // new winston.transports.File({
      //   level: "info",
      //   filename: "logs/info.log",
      // }),
      // new winston.transports.File({
      //   level: "debug",
      //   filename: "logs/debug.log",
      // }),
      new winston.transports.Console(),
    ],
  });
};

// Export the function so it can be imported in other files
module.exports = {
  logger,
};

// const { format, createLogger, transports, addColors } = require("winston");
// const { timestamp, combine, printf, errors, json } = format;
// require("winston-daily-rotate-file");

// function buildDevLogger() {
//   const consoleFormat = printf(({ level, message, timestamp, stack }) => {
//     return `${timestamp} ${level}: ${stack || message}`;
//   });

//   const infoAndWarnFilter = format((info, opts) => {
//     return info.level === "info" || info.level === "warn" ? info : false;
//   });

//   const errorFilter = format((info, opts) => {
//     return info.level === "error" ? info : false;
//   });

//   const debugFilter = format((info, opts) => {
//     return info.level === "debug" ? info : false;
//   });

//   const customLevels = {
//     levels: {
//       error: 0,
//       warn: 1,
//       info: 2,
//       debug: 3,
//       all: 4,
//     },
//     colors: {
//       error: "red",
//       warn: "yellow",
//       info: "green",
//       debug: "grey",
//       all: "white",
//     },
//   };

//   var logger = createLogger({
//     levels: customLevels.levels,
//     format: combine(
//       timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
//       errors({ stack: true }),
//       json(),
//       consoleFormat
//     ),
//     exitOnError: false,
//     transports: [
//       new transports.Console({
//         format: combine(format.colorize(), _consoleFormat),
//         level: "all",
//       }),
//       new transports.File({
//         filename: "./logs/0-error.log",
//         level: "error",
//         format: combine(errorFilter(), _format),
//       }),
//       new transports.File({
//         filename: "./logs/warn-info.log",
//         level: "info",
//         format: combine(infoAndWarnFilter(), _format),
//       }),
//       new transports.DailyRotateFile({
//         filename: "./logs/%DATE% - debug.log",
//         datePattern: "DD-MM-YYYY",
//         zippedArchive: true,
//         level: "debug",
//         format: combine(debugFilter(), _format),
//       }),
//       new transports.DailyRotateFile({
//         filename: "./logs/%DATE% - general.log",
//         datePattern: "DD-MM-YYYY",
//         zippedArchive: true,
//         level: "all",
//       }),
//     ],
//   });
//   addColors(customLevels.colors);

//   return logger;
// }

// module.exports = buildDevLogger;
