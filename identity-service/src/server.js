/* Libraries */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { default: mongoose } = require("mongoose");

/* Config */
const ENV_VARIABLES = require("./config/env.config");
const RateLimitRedisConfig = require("./config/rate-limiter-redis.config");

/* Utils */
const logger = require("./utils/logger.utils");

/* Use Cases */
const redisClient = require("./use-cases/redis.use-cases");

/* Routers */
const authRoutes = require("./routes/identity-service.routes");
const rateLimiter = require("./middelwares/rate-limiter.middlewared");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
	logger.info(`Received ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${req.body}`);
	next();
});

app.use(rateLimiter(RateLimitRedisConfig));

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
