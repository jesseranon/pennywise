const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const formatRelative = require('date-fns/formatRelative')
const addMinutes = require('date-fns/addMinutes')

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
};
