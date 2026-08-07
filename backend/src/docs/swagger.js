const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Única Chinelos",
      version: "1.0.0",
      description:
        "API REST desenvolvida para o sistema de gerenciamento da Única Chinelos.",
      contact: {
        name: "Felipe Nantes",
        email: "felipenantes1303@gmail.com",
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;