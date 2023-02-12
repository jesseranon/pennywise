const express = require("express");
const router = express.Router();
const forecastsController = require("../controllers/forecasts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Forecast routes
router.get('/createForecast', ensureAuth, forecastsController.getCreateForecastForm)
router.post('/createForecast', ensureAuth, forecastsController.postForecast)

router.get('/updateForecast/:id', ensureAuth, forecastsController.getUpdateForecastForm)
router.put('/updateForecast/:id', ensureAuth, forecastsController.updateForecast)

router.get('/convertForecast/:id', ensureAuth, forecastsController.getForecastToTransactionForm)
router.post('/convertForecast/:id', ensureAuth, forecastsController.postForecastToTransaction)

router.get('/deleteForecast/:id', ensureAuth, forecastsController.deleteForecast)

module.exports = router