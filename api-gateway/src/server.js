import express from "express";

import ENV_VARIABLES from "./config/env.config.js";

const app = express();

app.listen(ENV_VARIABLES.PORT, () => {
	console.log(`API Gateway listening on port: ${ENV_VARIABLES.PORT}`);
});
