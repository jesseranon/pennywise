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
    
    const amount = req.body.amount
    const category = catCheck._id
    const date = req.body.date
    const user = req.user._id

    const newForecast = new Forecast({
      amount,
      category,
      date,
      user
    })
    await newForecast.save()
    await User.findOneAndUpdate(
      { _id: req.user._id},
      { $push: {
          forecasts: newForecast._id
        }
      }
    )
    res.redirect("/profile")
  }
};
