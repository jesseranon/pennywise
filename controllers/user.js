const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const formatRelative = require('date-fns/formatRelative')
const addMinutes = require('date-fns/addMinutes')
const getDaysInMonth = require('date-fns/getDaysInMonth')
const format = require('date-fns/format')

module.exports = {
    getProfile: async (req, res) => {
        console.log(`hello from user controller`)
        try {
            const user = await User.findOne({ _id: req.user.id })
                .populate('accounts')
                .populate('categories')
                .populate('transactions')
                .populate({
                    path: 'forecasts',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                })

            const items = {
                user,
                formatRelative: formatRelative,
                addMinutes: addMinutes
            }
            res.render("profile.ejs", items);
        } catch (err) {
            console.log(err);
        }
    },
    getCalendar: async (req, res) => {
        console.log(`hello from user controller`)
        try {
            const user = await User.findOne({ _id: req.user.id })
                .populate({
                    path: 'transactions',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                })
                .populate({
                    path: 'forecasts',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                })

            console.log(user)
            const today = addMinutes(new Date(Date.UTC(2023, 0, 18)), 480)
            console.log(today)
            console.log(format(today, 'EEEE'))
            const items = {
                user: user,
                formatRelative: formatRelative,
                addMinutes: addMinutes,
                getDaysInMonth: getDaysInMonth,
                format: format
            }
            res.render("calendar.ejs", items);
        } catch (err) {
            console.log(err);
        }
    },
    getCalendarEvents: async (req, res) => {
        console.log(`getCalendarEvents controller`)
        // console.log(req.user)
        try {
            const user = await User.findOne({ _id: req.user.id })
                .populate({
                    path: 'transactions',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                })
                .populate({
                    path: 'forecasts',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                })
            
            res.json({currency: user.currency, events: user.forecasts})
        } catch (err) {
            console.log(err)
        }
        
    }
};
