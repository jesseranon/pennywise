const mongoose = require("mongoose")
const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const Forecast = require("../models/Forecast")
const { checkCategory } = require("./categories")
const transactionsController = require("./transactions")

module.exports = {
  //CrUD actions
  // TODO: re-order post, update, delete functions
  // TODO: rename to createForecast
  postForecast: async (req, res) => {
    // console.log(`hello from forecastsController.postForecast`)
    // console.log(`incoming info`, req.body)
    // const catCheck = await checkCategory(req.user._id, req.body.category)
    
    // const amount = req.body.amount
    // const accountingType = req.body.accountingType
    // const category = catCheck._id
    // const date = req.body.date
    // const user = req.user._id

    console.log(req.body)
    const today = new Date()
    const year = today.getFullYear()
    const month = pad(today.getMonth() + 1)
    const date = pad(today.getDate())
    function pad(s) {
      if (s.length < 2) s = '0' + s
      return s
    }
    console.log(`server side date: ${year}-${month}-${date}`)

    // create a date that doesn't show up as the previous date if the user's locale is behind GMT
    // use time segment from new Date()
    // append it to the incoming date string to create an ISO Date format string
    // may have to have frontend generate timestring and send it up.
    // console.log(`incoming date ${date}`)
    // console.log(`now: ${now}`)
    // const nowTimeSegment = now.slice(now.indexOf('T'))
    // console.log(`time segment: ${nowTimeSegment}`)
    // const forecastISOString = date + nowTimeSegment
    // console.log(`forecastISOString: ${forecastISOString}`)
    // const forecastDate = new Date(forecastISOString)
    // console.log(`forecastDate: ${forecastDate}`)

    // const newForecast = new Forecast({
    //   amount,
    //   accountingType,
    //   category,
    //   date: forecastDate,
    //   user
    // })
    // await newForecast.save()
    // await User.findOneAndUpdate(
    //   { _id: req.user._id},
    //   { $push: {
    //       forecasts: newForecast._id
    //     }
    //   }
    // )
    res.redirect("/profile")
  },
  getCalendar: async (req, res) => {
    res.render("calendar.ejs")
  },
  updateForecast: async (req, res) => {
    //allows user to update date, amount, and/or category of forecast
    console.log('hello from forecastController.updateForecast')
    console.log(req.body)

    const { accountingType, amount, category, date } = req.body
    
    console.log(`
      accountingType: ${accountingType},
      amount: ${amount},
      category: ${category},
      date: ${date}
    `)

    const foundCategory = await Category.findOne({
      name: category
    })

    const categoryId = foundCategory._id

    await Forecast.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.id
      },
      {
        $set: {
          accountingType,
          amount,
          category: categoryId,
          date
        }
      }
    )
    try {
      // stuff
      res.redirect('/profile')
    } catch (err) {
      res.redirect('back')
    }
  },
  deleteForecast: async (req, res) => {
    //delete forecast from database
    //can also be used when converting forecasts into transactions
    // 1. remove from user's forecasts array
    // 2. delete from database
    // 3. redirect to profile
    console.log(`hello from forecastsController.deleteForecast`)
    const targetForecastId = req.params.id
    const userId = req.user._id
    try {
      const user = await User.findOne({
        _id: userId
      })
      user.forecasts = user.forecasts.filter(f => f._id != targetForecastId)
      await user.save()
      Forecast.findOneAndDelete({ _id: targetForecastId })
      res.redirect('/profile')
    } catch (err) {
      console.log(err)
    }
  },
  // form functions
  getCreateForecastForm: async (req, res) => {
    const user = req.user
    res.render("forecastform.ejs", {user, mode: 'create'})
  },
  getUpdateForecastForm: async (req, res) => {
    try {
      console.log('hello from forecasts controller')
      console.log('forecast id', req.params.id)

      const user = await User.findOne({ _id: req.user._id, forecasts: req.params.id}).populate('categories')

      const forecast = await Forecast.findOne({ user: user._id, _id: req.params.id }).populate('category')
      console.log(user)
      console.log(forecast)

      res.render("forecastform.ejs", {user, mode: 'edit', forecast})
    } catch (err) {
      console.log(err)
      res.redirect('/profile')
    }
  },
  // convert to transaction form
  getForecastToTransactionForm: async (req, res) => {
    const userId = req.user._id
    const forecastId = req.params.id
    
    try {
      // needs access to user.populate('accounts').populate('categories') for accounts
      const user = await User.findOne({
        _id: userId,
        forecasts: forecastId
      }).populate('accounts').populate('categories')
      // needs access to forecast.populate('category')
      const forecast = await Forecast.findOne({
        user: userId,
        _id: forecastId
      }).populate('category')
      // user must be able to choose account
      // // deposits must go into an asset account
      // current balance must be displayed for the chosen account (dynamically update)
      // deposit/spend action must be locked in
      // user must be able to update amount
      // category must be locked in
      res.render('forecastform.ejs', {user, mode: 'convert', forecast})
    } catch (err) {
      console.log(err)
      res.redirect('/profile')
    }
  },
  postForecastToTransaction: async (req, res) => {
    try {
      console.log(req.body)
      // use transactionsController.postTransaction to post transaction
      res.redirect(307, `/transaction/post/${req.body.account}/${req.params.id}`)
    } catch (err) {
      console.log(err)
      res.redirect('/profile')
    }
  }
};
