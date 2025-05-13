import "dotenv/config";

export default {
	PORT: process.env.PORT ?? 3001,
	MONGO_DB_URI: process.env.MONGO_DB_URI ?? "",
	JWT_SECRET: process.env.JWT_SECRET ?? "",
};
