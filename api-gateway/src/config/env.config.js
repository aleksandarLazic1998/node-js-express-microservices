require("dotenv/config");

module.exports = {
	PORT: process.env.PORT ?? 3001,
	NODE_ENV: process.env.NODE_ENV ?? "development",
	IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL ?? "some-host",
	REDIS_PORT: process.env.REDIS_PORT ?? 6379,
	REDIS_HOST: process.env.REDIS_HOST ?? "localhost",
};
