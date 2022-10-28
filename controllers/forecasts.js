const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const Payee = require("../models/Payee")
const Forecast = require("../models/Forecast")

module.exports = {
  getCalendar: async (req, res) => {
    res.render("calendar.ejs")
  },
  getForecastForm: async (req, res) => {
    const user = req.user
    res.render("forecastform.ejs", {user})
  },
  postForecast: async (req, res) => {
    console.log(await Category.find({name: 'utilities'}))
    // const newForecast = new Forecast(req.body);
    // console.log(newForecast)
    // await User.findOneAndUpdate({ _id: req.user._id},
    //   {$push: {
    //     forecasts: newForecast
    //   }
    // })
  }
};
