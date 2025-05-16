require("dotenv/config");

module.exports = {
	PORT: process.env.PORT ?? 3001,
	MONGO_DB_URI: process.env.MONGO_DB_URI ?? "mongodburi",
	JWT_SECRET: process.env.JWT_SECRET ?? "jwtsecret",
	NODE_ENV: process.env.NODE_ENV ?? "development",
	REDIS_URL: process.env.REDIS_URL ?? "redisurl",
};
