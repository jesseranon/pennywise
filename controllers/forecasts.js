const mongoose = require("mongoose")
const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const Forecast = require("../models/Forecast")
const { checkCategory } = require("./categories")

module.exports = {
  getCalendar: async (req, res) => {
    res.render("calendar.ejs")
  },
  getForecastForm: async (req, res) => {
    const user = req.user
    res.render("forecastform.ejs", {user})
  },
  postForecast: async (req, res) => {
    // console.log(`hello from forecastsController.postForecast`)
    // console.log(`incoming info`, req.body)
    const catCheck = await checkCategory(req.user._id, req.body.category)
    const {categoryId} = catCheck
    const newForecast = new Forecast(req.body)
    await User.findOneAndUpdate(
      { _id: req.user._id},
      { $push: {
          forecasts: newForecast
        }
      }
    )
    res.redirect("/profile")
  }
};
