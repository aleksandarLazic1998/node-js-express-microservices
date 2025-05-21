const logger = require("../utils/logger.utils");

const options = {
	proxyReqPathResolver: function (req) {
		return req.originalUrl.replace(/^\/v1/, "/api");
	},
	proxyErrorHandler: (err, res, next) => {
		logger.error(`Proxy error: ${err.message}`);
		res
			.status(500)
			.json({ message: "Internal server error", error: err.message });
	},
};

module.exports = {
	proxyOptions: options,
};
