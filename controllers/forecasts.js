const mongoose = require("mongoose")
const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const Forecast = require("../models/Forecast")
const { checkCategory } = require("./categories")
const transactionsController = require("./transactions")
const addMinutes = require('date-fns/addMinutes')
const differenceInDays = require('date-fns/differenceInDays')

module.exports = {
  //CrUD actions
  // TODO: re-order post, update, delete functions
  // TODO: rename to createForecast
  postForecast: async (req, res) => {
    console.log(`hello from forecastsController.postForecast`)
    console.log(`incoming info`, req.body)
    try {
      const catCheck = await checkCategory(req.user._id, req.body.category)
    
      const amount = req.body.amount
      const accountingType = req.body.accountingType
      const category = catCheck._id
      let date = req.body.date
      const user = req.user._id

      // store date as UTC
      const [year, month, day] = req.body.date.split('-')
      date = new Date(Date.UTC(year, Number(month) - 1, day))

      const newForecast = new Forecast({
        amount,
        accountingType,
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
    } catch (err) {
      console.log(err)
      res.redirect("/profile")
    }
    
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
    const user = await User.findOne({
      _id: req.user._id
    }).populate('categories')
    console.log(user)
    res.render("forecastForm.ejs", {user, mode: 'create'})
  },
  getUpdateForecastForm: async (req, res) => {
    try {
      console.log('hello from forecasts controller')
      console.log('forecast id', req.params.id)

      const user = await User.findOne({ _id: req.user._id, forecasts: req.params.id}).populate('categories')

      const forecast = await Forecast.findOne({ user: user._id, _id: req.params.id }).populate('category')
      console.log(user)
      console.log(forecast)

      res.render("forecastForm.ejs", {user, mode: 'edit', forecast})
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
      res.render('forecastForm.ejs', {user, mode: 'convert', forecast})
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
