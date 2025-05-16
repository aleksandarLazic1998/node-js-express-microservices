const Redis = require("ioredis");
const ENV_VARIABLES = require("../config/env.config");

class RedisClient {
	client;

	static async connect(redisUrl) {
		this.client = new Redis(redisUrl);

		return this.client;
	}
}

const client = (URL) => RedisClient.connect(URL);

module.exports = Object.freeze(client(ENV_VARIABLES.REDIS_URL));
