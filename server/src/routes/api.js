const express = require("express");
const allRoutes = express.Router();
allRoutes.use("/auth", register);
module.exports = allRoutes;
