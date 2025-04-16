const express = require("express");
const authRoutes = express.Router();
authRoutes.use("/register", register);
module.exports = authRoutes;
