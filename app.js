const connectDB = require("./middleware/db.js");
const logger = require("./middleware/logger.js");
const dotenv = require("dotenv");
const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const fileUpload = require("express-fileupload");
const ErrorHandler = require("./middleware/error.js");
const authRouter = require("./routes/auth.js");
const blogRouter = require("./routes/blog.js");
const express = require("express");
const app = express();

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Api",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
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
  apis: [
    `${path.join(__dirname, "./controllers/auth.js")}`,
    `${path.join(__dirname, "./controllers/blog.js")}`,
  ],
};

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Logs request to console
app.use(logger);

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use(ErrorHandler);
app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerJsDoc(swaggerSpec))
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
