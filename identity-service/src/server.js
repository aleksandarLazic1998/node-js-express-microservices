/* Libraries */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const redis = require("ioredis");
const ENV_VARIABLES = require("./config/env.config");
const logger = require("./utils/logger.utils");
const { register } = require("./controllers/auth.controllers");
const { default: mongoose } = require("mongoose");

/* Config */

/* Routers */

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/", register);

app.listen(ENV_VARIABLES.PORT, async () => {
	await mongoose.connect(ENV_VARIABLES.MONGO_DB_URI);
	logger.info(`Identity service running on port ${ENV_VARIABLES.PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at", promise, "reason:", reason);
});

process.on("uncaughtException", (reason, promise) => {
	logger.error("Uncaught Exception at", promise, "reason:", reason);
});
