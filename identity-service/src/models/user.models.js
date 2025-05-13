import mongoose from "mongoose";
import argon2 from "argon2";

const UserSchema = mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		try {
			this.password = await argon2.hash(this.password);
		} catch (error) {
			return next(error);
		}
	}
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await argon2.verify(this.password, candidatePassword);
	} catch (error) {
		throw error;
	}
};

userSchema.index({ username: "text" });

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
