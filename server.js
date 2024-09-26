const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");
const app = express();
const { logger } = require('./src/logger/logger.js');
const serverLogger = logger('Server');

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: process.env.COOKIE_SESSION_NAME,
    secret: process.env.COOKIE_SESSION_SECRET, // should use as secret environment variable
    httpOnly: true,
  })
);

// Use the combined router
const router = require('./src/routes/mainRouter.js');
app.use('/api', router);

// swagger
const swaggerDocs = require("./src/swagger/swagger.js");

//port
const { DB_PORT } = process.env;
const PORT = process.env.PORT || DB_PORT;

// welcome message
app.get("/", (req, res) => {
  serverLogger.info("Welcome to application.");
  res.json({ message: "Welcome to application." });
});

//server
app.listen(PORT, function (err) {
  if (err) {
    serverLogger.error("Error: Error in server setup");
    return;
  }
  swaggerDocs(app, PORT);
  serverLogger.info(`Server listening on port: ${PORT}`);
});

// const server = app.listen(PORT);

// server.on('error', function (err) {
//   if (err.code === 'EADDRINUSE') {
//     serverLogger.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
//     process.exit(1);  // Exit the process if the port is already in use
//   } else {
//     serverLogger.error(`Server error: ${err.message}`);
//   }
// });

// server.on('listening', function () {
//   swaggerDocs(app, PORT);  // Initialize Swagger docs
//   serverLogger.info(`Server listening on port: ${PORT}`);
// });