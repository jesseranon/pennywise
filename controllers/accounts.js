const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const categoriesController = require("./categories")

module.exports = {
  getAccount: async (req, res) => {
    // this will be used to display the account page of a singular account
    const targetAccountId = req.params.id
    console.log(targetAccountId)
    try {
      const targetAccount = await Account.findOne({
        _id: targetAccountId
      }).populate({
        path: 'debits',
        populate: {
          path: 'category',
          model: 'Category'
        }
      }).populate({
        path: 'credits',
        populate: {
          path: 'category',
          model: 'Category'
        }
      })
      console.log(targetAccount)
      res.render("account.ejs", { user: req.user, account: targetAccount })
    } catch (err) {
      res.redirect("/profile")
    }
  },
  getCreateAccountForm: async (req, res) => {
    try {
      const user = User.findOne({
        _id: req.user._id
      })
      res.render('accountform.ejs', {user, mode: 'create'})
    } catch (err) {
      console.log(err)
      res.redirect('/profile')
    }
  },
  getUpdateAccountForm: async (req, res) => {
    try {
      const user = req.user
      const account = await Account.findOne({
        user: req.user.id,
        _id: req.params.id
      })
      console.log(account)
      res.render('accountform.ejs', {user, mode: 'edit', account: account} )
    } catch (err) {
      console.log(err)
      res.redirect('/profile')
    }
  },
  createAccount: async (req, res) => {
    const userId = req.user.id
    const cleanAccountName = req.body.createAccountName[0].toUpperCase() + req.body.createAccountName.slice(1).toLowerCase() 

    console.log(req.body.createAccountType)
    const assets = ['savings', 'checking', 'cash']
    const createAccountType = (assets.includes(req.body.createAccountType) ? 'asset' : 'liability')

    try {
      const newAccount = new Account({
        name: cleanAccountName,
        type: req.body.createAccountType,
        balanceType: createAccountType,
        currentBalance: req.body.createAccountBalance,
        user: userId
      });
      await newAccount.save()

      // console.log(newAccount)
      const newAccountPush = {
        accounts: newAccount._id
      }

      if (newAccount.balanceType === 'liability') {
        //create category {name: `${type} bill`} and put into push as categories
        const newCategoryName = `${newAccount.name} payment`
        const newCategory = await categoriesController.checkCategory(userId, newCategoryName, newAccount._id)
        console.log(newCategory)
      }

      await User.findOneAndUpdate(
        { _id: userId },
        { $push: newAccountPush }  
      )
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  updateAccount: async (req, res) => {
    // this will allow the user to modify the name of the account.
    // will also allow the user to modify the account type,
    // limited other types that share a balanceType of the account
    const targetAccountId = req.params.id
    const newAccountName = req.body.accountName
    const newType = req.body.accountType
    const newBalance = req.body.accountBalance
    try {
      const targetAccount = await Account.findOne({
        user: req.user._id,
        _id: targetAccountId
      })

      if (targetAccount.name === newAccountName && targetAccount.type === newType) {
        return res.redirect('/profile')
      }

      // if name was changed
      if (targetAccount.name !== newAccountName) {
        // find any categories tied to the account
        // update the category name to the new one
        await Category.findOneAndUpdate(
          {
            user: req.user._id,
            account: targetAccount._id
          },
          {
            $set: {
              name: newAccountName
            }
          }
        )
        // change the targetAccount name
        targetAccount.name = newAccountName
      }

      // if targetAccount type is changed,
      if (targetAccount.type !== newType) {
        // just change the type.
        targetAccount.type = newType
      }

      // if targetAccount currentBalance has been changed
      if (!targetAccount.debits.length && !targetAccount.credits.length && newBalance) {
        //update targetAccount currentBalance
        targetAccount.currentBalance = newBalance
      }

      await targetAccount.save()
      res.redirect('/profile')
    } catch (err) {
      console.log(err)
      res.redirect("/profile")
    }
  },
  deleteAccount: async (req, res) => {
    // this will allow the user to delete an account they created.
    // this will need to remove any references to the account from a category
    // and remove it from the user's accounts array
    // if there are transactions associated with an account, the account cannot be deleted
    try {
      const targetAccount = await Account.findOne({
        _id: req.params.id,
        user: req.user._id
      })

      if (targetAccount.debits.length || targetAccount.credits.length) {
        res.redirect('/profile')
      }

      const user = await User.findOne({ _id: req.user._id, accounts: req.params.id })

      const filteredAccounts = user.accounts.filter(account => account._id != req.params.id)

      user.accounts = filteredAccounts

      await user.save()
      
      await Category.deleteOne({
        user: req.user._id,
        account: req.params.id
      })

      await Account.deleteOne({
        _id: req.params.id,
        user: req.user._id
      })

      res.redirect('/profile')
    } catch (err) {
      console.log(err)
      res.redirect("/profile")
    }
  },
};
