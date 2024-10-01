const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");
const app = express();
const { logger } = require("./src/libs/logger.js");
const appLogger = logger("Server");

const http = require("http");
const { createTerminus, HealthCheckError } = require("@godaddy/terminus");

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
const router = require("./src/routes/mainRouter.js");
app.use("/api", router);

// swagger
const swaggerDocs = require("./src/libs/swagger.js");

//port
const { DB_PORT } = process.env;
const PORT = process.env.PORT || DB_PORT;

// welcome message
app.get("/", (req, res) => {
  appLogger.info("Welcome to application.");
  res.json({ message: "Welcome to application." });
});

const server = http.createServer(app);

createTerminus(server, {
  healthChecks: {
    "/healthcheck": async function () {
      const errors = [];
      return Promise.all(
        [
          // all your health checks goes here
        ].map((p) =>
          p.catch((error) => {
            // silently collecting all the errors
            errors.push(error);
            return undefined;
          })
        )
      ).then(() => {
        if (errors.length) {
          throw new HealthCheckError("Healthcheck failed", errors);
        }
      });
    },
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  },
});

//server
app.listen(PORT || 3000, function (err) {
  if (err) {
    appLogger.error("Error: Error in server setup");
    return;
  }
  swaggerDocs(app, PORT);
  appLogger.info(`Server listening on port: ${PORT}`);
});
