const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const ENV_VARIABLES = require("./config/env.config");
const errorHandler = require("./middlewares/error-handler.middlewares");
const logger = require("./utils/logger.utils");
const {
	rateLimiterRedis,
} = require("./middlewares/rate-limiter-redis.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

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

// DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "middleware",
	points: 10,
	duration: 1,
});

app.use(rateLimiterRedis(rateLimiter));

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
