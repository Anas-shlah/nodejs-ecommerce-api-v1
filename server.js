const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
var cors = require("cors");
var compression = require("compression");

dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

// Routes
const categoryRoute = require("./apis/categoryRoute");
const subCategoryRoute = require("./apis/subCategoryRoute");
// const brandRoute = require("./apis/brandRoute");
const productRoute = require("./apis/productRoute");
const userRoute = require("./apis/userRoute");
const authRoute = require("./apis/authRoute");

// connect with db
dbConnection();
// express app
const app = express();

app.use(cors());
app.options("*", cors());

// compress responses
app.use(compression());

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//  Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
// app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.use("*", (req, res, next) => {
  // const err = Error(`Can't find route: ${req.originalUrl}`);
  next(new ApiError(`Can't find route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
