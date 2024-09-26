const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "App User API",
      description: "API endpoints for a app services documented on swagger",
      contact: {
        name: "Sunil M G",
        email: "sunilmithoor89@gmail.com",
        url: "https://github.com/SunilMithoor/Node-JS-Apis",
      },
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:3001/",
        description: "Local server",
      },
      // {
      //   url: "<your live url here>",
      //   description: "Live server",
      // },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, PORT) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
