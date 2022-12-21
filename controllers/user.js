const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")

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
            res.render("profile.ejs", { user });
        } catch (err) {
            console.log(err);
        }
    },
};
