const redisClient = require("../use-cases/redis.use-cases");

const RateLimitRedisConfig = {
	storeClient: redisClient,
	keyPrefix: "middleware",
	points: 10,
	duration: 1,
};

module.exports = RateLimitRedisConfig;
