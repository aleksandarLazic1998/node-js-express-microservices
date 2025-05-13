/* Libraries */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import redis from "ioredis";

/* Config */
import ENV_VARIABLES from "./config/env.config.js";
import logger from "./utils/logger.utils.js";

/* Routers */

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.listen(ENV_VARIABLES.PORT, () => {
	logger.info(`Identity service running on port ${ENV_VARIABLES.PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
