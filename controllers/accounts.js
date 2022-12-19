const User = require("../models/User")
const Account = require("../models/Account")
const Category = require("../models/Category")
const categoryController = require("./categories")

module.exports = {
  getAccount: async (req, res) => {
    // this will be used to display the account page of a singular account
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
        //create category {name: `${type} bill`} and put into push as categories
        const newCategory = new Category({
          name: `${newAccount.name} payment`,
          account: newAccount._id,
          user: userId
        })
        await newCategory.save()
        newAccountPush.categories = newCategory._id
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
  modifyAccount: async (req, res) => {
    // this will allow the user to modify the name of the account.
  },
  deleteAccount: async (req, res) => {
    // this will allow the user to delete an account they created.
    // this will need to remove any references to the account from a category
    // and remove it from the user's accounts array
  },
};
