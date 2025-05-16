const AuthModel = require("./auth.models");
const UserModel = require("./user.models");

const db = {
	Users: UserModel,
	Auth: AuthModel,
};

module.exports = { db };
