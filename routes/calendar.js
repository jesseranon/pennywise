const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const forecastsController = require("../controllers/forecasts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Calendar routes
router.get('/', userController.getCalendar)

module.exports = router