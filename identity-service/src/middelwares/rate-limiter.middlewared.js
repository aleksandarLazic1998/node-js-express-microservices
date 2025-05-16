const { RateLimiterRedis } = require("rate-limiter-flexible");

const rateLimiter = (options) => (err, req, res, next) => {
	const rateLimiterRedis = new RateLimiterRedis(options);

	rateLimiterRedis
		.consume(req.ip)
		.then(() => next())
		.catch(() => {
			logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
			return res
				.status(429)
				.json({ success: false, message: "Too many requests" });
		});
};

module.exports = rateLimiter;
