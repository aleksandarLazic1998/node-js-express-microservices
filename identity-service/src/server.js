/* Libraries */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { default: mongoose } = require("mongoose");
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

/* Config */
const ENV_VARIABLES = require("./config/env.config");
const {
	globalErrorhandler,
} = require("./middlewares/error-handler.middlewares");
/* Utils */
const logger = require("./utils/logger.utils");

/* Routers */
const authRoutes = require("./routes/identity-service.routes");
const { rateLimiterRedis } = require("./middlewares/rate-limiter.middlewares");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
	logger.info(`Received ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${req.body}`);
	next();
});

const redisClient = new Redis({
	port: ENV_VARIABLES.REDIS_PORT,
	host: ENV_VARIABLES.REDIS_HOST,
});

redisClient.on("error", (error) => {
	logger.error("Redis connection error", error);
});
redisClient.on("connect", () => {
	logger.info("Redis client connected in identity Service");
});

// //DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "middleware",
	points: 10,
	duration: 1,
});

app.use((req, res, next) => {
	logger.info(`Received ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${req.body}`);
	next();
});

app.use(rateLimiterRedis(rateLimiter));

app.use("/auth", authRoutes);

app.use(globalErrorhandler);

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
