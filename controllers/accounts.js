const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const categoryController = require("./categories")

module.exports = {
  getAccount: async (req, res) => {
    try { 
      const user = req.user
      User.find(
        {_id: req.user._id},
      )
      // .populate({
      //   path: 'accounts',
      //   populate: [
      //     {path: 'debits'},
      //     {path: 'credits'}
      //   ]
      // })
      .exec((err, u) => {
        if (u) {
          console.log(u[0].accounts)
          const account = u[0].accounts.filter(account => account._id == req.params.id)[0]
          res.render('account.ejs', { account, user })
        }
      })      
    } catch (err) {
      console.log(err);
    }
  },
  createAccount: async (req, res) => {
    const userId = req.user.id
    console.log(req.body.createAccountType)
    const assets = ['savings', 'checking', 'cash']
    const createAccountType = (assets.includes(req.body.createAccountType) ? 'asset' : 'liability')

    try {
      const newAccount = new Account({
        name: req.body.createAccountName,
        type: req.body.createAccountType,
        balanceType: createAccountType,
        currentBalance: req.body.createAccountBalance,
        user: userId
      });
      await newAccount.save()

      console.log(newAccount)
      const newAccountPush = {
        accounts: newAccount._id
      }
      
      if (newAccount.balanceType === 'liability') {
        //create payee & category {name: `${type} bill`} and put into push as categories
        const newCategory = new Category({
          name: `${newAccount.name} payment`,
          account: newAccount._id,
          user: userId
        })
        await newCategory.save()
        newAccountPush.categories = newCategory._id
      }

      console.log('to $push:', newAccountPush)
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: newAccountPush }  
      )
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
    // console.log(`create account for user id ${req.user.id}`)
  },
  modifyAccount: async (req, res) => { //Probably only going to allow for changing name
    try {
      // Find account by id
      // account id will come in from req.params.
      // new account name will come in from form -> req.body.newAccountName
      const newAccountName = req.body.newAccountName

    } catch (err) {
      res.redirect("/profile");
    }
  },
  deleteAccount: async (req, res) => { //delete a whole-ass account
    try {
      // get user
      // remove account by setting user.accounts to filter out the account id out
      // save user
      // Find account by id
      let account = await Account.findById({ _id: req.params.id });
      //delete account
      //remove from User.accounts
    } catch (err) {
      console.error(err)
    }
    res.redirect("/profile");
  },
};
