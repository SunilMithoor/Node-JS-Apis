const { logger } = require("../logger/logger.js");
const utilLogger = logger("Terminate");

function terminate (server, options = { coredump: false, timeout: 500 }) {
    // Exit function
    const exit = code => {
      options.coredump ? process.abort() : process.exit(code)
    }
  
    return (code, reason) => (err, promise) => {
      if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      utilLogger.info(`Error  :: ${err.message}`);
      utilLogger.info(`Error  :: ${err.stack}`);
      }
  
      // Attempt a graceful shutdown
      server.close(exit)
      setTimeout(exit, options.timeout).unref()
    }
  }
  
  module.exports = {
    terminate,
  };

  