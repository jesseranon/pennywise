const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const accountsController = require("../controllers/accounts");
const transactionsController = require("../controllers/transactions");
const forecastsController = require("../controllers/forecasts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Forecast routes
router.get('/', forecastsController.getCalendar)

router.get('/createForecast', forecastsController.getForecastForm)
router.post('/createForecast', forecastsController.postForecast)

module.exports = router