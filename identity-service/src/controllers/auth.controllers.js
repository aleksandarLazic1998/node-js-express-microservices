const logger = require("../utils/logger.utils");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../utils/tokens.utils");
const { validateRegistration } = require("../utils/validation.utils");
const UserModel = require("../models/user.models");
const AuthModel = require("../models/auth.models");

const register = async (req, res) => {
	logger.info("Registration started");
	const { body } = req;

	try {
		// Validate Schema
		const { error } = validateRegistration(body);
		if (!error) {
			logger.warn("Validation Error", error.details[0].message);
			return res.status(422).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const { email, password, username } = body;

		const userAlreadyExist = await UserModel.findOne({
			$or: [{ email }, { username }],
		});

		if (userAlreadyExist) {
			logger.warn(
				"User already Exist.",
				`User with email: ${email} or username: ${username} already exist.`
			);
			return res.status(400).json({
				success: false,
				message: `User with email: ${email} or username: ${username} already exist.`,
			});
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const user = new UserModel({
			username,
			email,
			password: hashPassword,
		});

		await user.save();

		const { refreshToken, expirations } = generateTokens({
			username,
			email,
			id: user._id,
		});

		const authForUser = new AuthModel({
			token: refreshToken,
			expiresAt: expirations,
			userId: user._id,
		});

		await authForUser.save();

		return res.status(201).json({
			message: `Successfully created user with email: ${user.email}`,
		});
	} catch (error) {
		logger.error("Registration error", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// Refresh Token

// Login

// Logout

module.exports = { register };
