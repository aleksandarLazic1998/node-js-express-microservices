const logger = require("../utils/logger.utils");

const rateLimiterRedis = (rateLimiter) => (err, req, res, next) => {
	rateLimiter
		.consume(req.ip)
		.then(() => next())
		.catch(() => {
			logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
			return res
				.status(429)
				.json({ success: false, message: "Too many requests" });
		});
};

module.exports = { rateLimiterRedis };
