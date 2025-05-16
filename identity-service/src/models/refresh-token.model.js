import mongoose from "mongoose";

const AuthSchema = mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			unique: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},

		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

AuthSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

const AuthModel = mongoose.model("Auth", AuthSchema);

export default AuthModel;
