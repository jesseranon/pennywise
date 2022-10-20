const Account = require("../models/Account")
const User = require("../models/User")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id })
        .populate(
          {
            path: 'accounts',
            populate: {
              path: 'transactions'
            }
          },
        )
      console.log(user)
      user.accounts.forEach(account => {
        account.currentBalance = account.currentBalance.toString()
      })
      res.render("profile.ejs", { user: user });
    } catch (err) {
      console.log(err);
    }
  },
  getAccount: async (req, res) => {
    try {
      const account = await Account.findById(req.params.id);
      res.render("account.ejs", { account: account, user: req.user });
    } catch (err) {
      console.log(err);
    } 
  },
  createAccount: async (req, res) => {
    const userId = req.user.id
    console.log(req.body.createAccountType)
    const assets = ['savings','checking', 'cash']
    const createAccountSubType = (assets.includes(req.body.createAccountType) ? 'asset' : 'liability')
    console.log(createAccountSubType)
    try {
      const newAccount = await Account.create({
        accountName: req.body.createAccountName,
        accountType: req.body.createAccountType,
        accountSubType: createAccountSubType,
        currentBalance: req.body.createAccountBalance,
        owner: req.user.id,
      });
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { accounts: newAccount }
        }
      )
      console.log(user.accounts)
      console.log(`successfully created new account`)
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
    // console.log(`create account for user id ${req.user.id}`)
  },
  modifyAccount: async (req, res) => { //Probably only going to allow for changing name
    try {
      // Find account by id
      let account = await Account.findOneAndUpdate(
        { _id: req.params.id },
        // name: req.body.newAccountName
      )
    } catch (err) {
      res.redirect("/profile");
    }
  },
  deleteAccount: async (req, res) => { //delete a whole-ass account
    try {
      // Find account by id
      let account = await Account.findById({ _id: req.params.id });
      //delete account
      //remove from User.accounts
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  // TRANSACTIONS
  postTransaction: async (req, res) => {
    console.log(`post transaction request for ${req.params.accountId}`)
    console.log(req.body)
    res.redirect("/profile")
  },
};
