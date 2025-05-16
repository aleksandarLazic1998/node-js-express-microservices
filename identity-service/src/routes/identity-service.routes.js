const express = require("express");

const route = express.Router();
const authController = require("../controllers/auth.controllers");

route.post("/register", authController.register);

module.exports = route;
