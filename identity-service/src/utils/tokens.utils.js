const JWT = require("jsonwebtoken");
const ENV_VARIABLES = require("../config/env.config");

const generateTokens = (userInfo) => {
	const accessToken = JWT.sign({ userInfo }, ENV_VARIABLES.JWT_SECRET, {
		expiresIn: "1h",
	});

	const refreshToken = JWT.sign({ userInfo }, ENV_VARIABLES.JWT_SECRET, {
		expiresIn: "10d",
	});

	return {
		accessToken,
		refreshToken,
		expirations: new Date().setDate(new Date().getDate() + 10),
	};
};

module.exports = { generateTokens };
