/* Libraries */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const redis = require("ioredis");
const { default: mongoose } = require("mongoose");

/* Config */
const ENV_VARIABLES = require("./config/env.config");

/* Utils */
const logger = require("./utils/logger.utils");

/* Routers */
const authRoutes = require("./routes/identity-service.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRoutes);

async function bootstrap() {
	try {
		await mongoose.connect(ENV_VARIABLES.MONGO_DB_URI);
		logger.info("Identity service is connected to DB");

		app.listen(ENV_VARIABLES.PORT, async () => {
			logger.info(`Identity service running on port ${ENV_VARIABLES.PORT}`);
		});
	} catch (error) {
		logger.error(error);
	}
}

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at", promise, "reason:", reason);
});

process.on("uncaughtException", (reason, promise) => {
	logger.error("Uncaught Exception at", promise, "reason:", reason);
});

bootstrap();
