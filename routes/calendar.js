const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const forecastsController = require("../controllers/forecasts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Calendar routes
router.get('/', ensureAuth, userController.getCalendar)

router.get('/getCalendarEvents', ensureAuth, userController.getCalendarEvents)

module.exports = router