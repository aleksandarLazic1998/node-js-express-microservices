import express from "express";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

import ENV_VARIABLES from "./config/env.config.js";
import errorHandler from "./middlewares/error-handler.middlewares.js";
import logger from "./utils/logger.utils.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	logger.info(`Received ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${req.body}`);
	next();
});

bootstrap();

app.use(errorHandler);

async function bootstrap() {
	app.listen(ENV_VARIABLES.PORT, () => {
		logger.info(`API Gateway listening on port: ${ENV_VARIABLES.PORT}`);
	});
}
