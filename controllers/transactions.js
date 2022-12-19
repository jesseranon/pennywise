const mongoose = require("mongoose")
const Account = require("../models/Account")
const Category = require("../models/Category")
const Transaction = require("../models/Transaction")
const User = require("../models/User")

const accountsController = require("./accounts")
const categoriesController = require("./categories")

module.exports = {
    displayTransactionForm: async (req, res) => {
        //send up the transaction form
        const accountId = req.params.accountId
        const userId = req.user.id
        try {
            const user = await User.findOne({ _id: userId })
                .populate('categories')
                .populate('accounts')
            const account = user.accounts.filter(account => account._id == accountId)[0]
            console.log(`transaction form requested for account ${req.params.accountId}`)
            console.log(account)
            res.render("transactionform.ejs", {user:user, account: account})
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
    //CRUD Operations on single transactions
    //will have to save Account in order to save transactions
    getTransaction: async (req, res) => {
        //display a single transaction's details
        console.log(`transaction details requested for transaction ${req.params.id}`)
    },
    modifyTransaction: async (req, res) => {
        //modify a single transaction's details
        console.log(`transaction modification requested for transaction ${req.params.id}`)
        res.redirect("/profile")
    },
    deleteTransaction: async (req, res) => {
        //delete a single transaction
        console.log(`transaction delete requested for transaction ${req.params.id}`)
        res.redirect("/profile")
    },
    postTransaction: async (req, res) => {
        // console.log(`hello from postTransaction in transactions controller`)
        try {
            const accountAction = req.body.accountingType
            const accountId = req.params.accountId

            // check if the category exists
            let category = await categoriesController.checkCategory(req.user._id, req.body.category)
            
            // if it does not, create it with user: req.user._id
            if (typeof category === 'string') {
                category = await categoriesController.postCategory(req.user._id, category)
            }

            category = category._id
            const user = req.user._id

            // set newTransaction params
            const amount = req.params.amount

            // create newTransaction
            const newTransaction = new Transaction({
                amount,
                category,
                user
            })
            await newTransaction.save()
            const transactionId = newTransaction._id

            // // set up dynamic update object
            // const update = {
            //     '$push': {},
            //     '$inc': {}
            // }
            // update['$push'][accountAction] = transactionId
            // update['$inc'].accountBalance = 

            // push transaction to mainAccount
            // update mainAccount.currentBalance
            const mainAccount = await Account.findOne(
                {
                    _id: accountId,
                    user
                }
            )
            // push newTransaction._id to mainAccount[accountAction]
            console.log(accountAction)
            mainAccount[accountAction].push(transactionId)
            // increment account.currentBalance
            const currentBalance = mainAccount.currentBalance
            console.log(newTransaction.amount)
            console.log(mainAccount.balanceType)
            if (mainAccount.balanceType === 'asset') {
                if (accountAction === 'debits') {
                    mainAccount.currentBalance = Number(currentBalance) + Number(newTransaction.amount)
                }
                else mainAccount.currentBalance = Number(currentBalance) - Number(newTransaction.amount)
            } else if (mainAccount.balanceType === 'liability') {
                if (accountAction === 'credits') {
                    mainAccount.currentBalance = Number(currentBalance) - Number(newTransaction.amount)
                }
                else mainAccount.currentBalance = Number(currentBalance) + Number(newTransaction.amount) 
            }
            mainAccount.save()

            // if category is associated with an account,
            // push transactionId to the category.account
            if (category.account) {
                // const accountOtherAction = (accountAction === 'debits' ? 'credits')
                // const secondAccount = Account.find({_id: category.account._id})
                // push newTransaction._id to secondAccount[accountOtherAction]
            }
            res.redirect("/profile")
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
};
