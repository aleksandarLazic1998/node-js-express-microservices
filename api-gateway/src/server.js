const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const proxy = require("express-http-proxy");

const ENV_VARIABLES = require("./config/env.config");
const errorHandler = require("./middlewares/error-handler.middlewares");
const logger = require("./utils/logger.utils");
const {
	rateLimiterRedis,
} = require("./middlewares/rate-limiter-redis.middleware");
const { proxyOptions } = require("./config/proxy.config");

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
	logger.info(
		`Redis client connected in API Gateway: redis://${ENV_VARIABLES.REDIS_HOST}:${ENV_VARIABLES.REDIS_PORT}`
	);
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
	logger.info(`Request body, ${JSON.stringify(req.body)}`);
	next();
});

/* Identity Service Proxy */

app.use(
	"/v1/auth",
	proxy(ENV_VARIABLES.IDENTITY_SERVICE_URL, {
		...proxyOptions,
		// You can override most request options before issuing the proxyRequest
		proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		// This will be called after getting response from service we called
		userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
			logger.info(
				`Response received from identity service: ${
					proxyRes.statusCode
				}, and data ${proxyResData.toString("utf8")}`
			);

			return proxyResData;
		},
	})
);

app.use(errorHandler);

async function bootstrap() {
	app.listen(ENV_VARIABLES.PORT, () => {
		logger.info(`API Gateway listening on port: ${ENV_VARIABLES.PORT}`);
		logger.info(
			`Identity service is running on port ${ENV_VARIABLES.IDENTITY_SERVICE_URL}`
		);
	});
}

bootstrap();
