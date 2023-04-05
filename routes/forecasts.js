const express = require("express");
const router = express.Router();
const forecastsController = require("../controllers/forecasts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Forecast routes
router.get('/create', ensureAuth, forecastsController.getCreateForecastForm)
router.post('/create', ensureAuth, forecastsController.postForecast)

// get updateForecast to be removed after modal is implemented.
router.get('/update/:id', ensureAuth, forecastsController.getUpdateForecastForm)
router.put('/update/:id', ensureAuth, forecastsController.updateForecast)

// get convertForecast to be removed after modal is implemented.
router.get('/convert/:id', ensureAuth, forecastsController.getForecastToTransactionForm)
router.post('/convert/:id', ensureAuth, forecastsController.postForecastToTransaction)

router.post('/delete/:id', ensureAuth, forecastsController.deleteForecast)

module.exports = router