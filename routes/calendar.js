const express = require("express");
const router = express.Router();
const forecastsController = require("../controllers/forecasts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Forecast routes
router.get('/', forecastsController.getCalendar)

router.get('/createForecast', forecastsController.getCreateForecastForm)
router.post('/createForecast', forecastsController.postForecast)

router.get('/updateForecast/:id', forecastsController.getUpdateForecastForm)
router.post('/updateForecast/:id', forecastsController.updateForecast)

router.get('/convertForecast/:id', forecastsController.getForecastToTransactionForm)
router.post('/convertForecast/:id', forecastsController.postForecastToTransaction)

router.post('/deleteForecast/:id', forecastsController.deleteForecast)

module.exports = router