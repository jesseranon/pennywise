const User = require("../models/User")
const Account = require("../models/Account")

module.exports = {
    getProfile: async (req, res) => {
        console.log(`hello from user controller`)
        try {
            const user = await User.findOne({ _id: req.user.id })
            res.render("profile.ejs", { user: user });
        } catch (err) {
            console.log(err);
        }
    },
};
