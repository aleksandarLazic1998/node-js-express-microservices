import AuthModel from "./refresh-token.model.js";
import UserModel from "./user.models.js";

const db = {
	users: UserModel,
	auth: AuthModel,
};

export default db;
