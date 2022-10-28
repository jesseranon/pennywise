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
            /*
            ON SAVING
            perform work on a dummy user object
            grab the user from the db
            set the user to the dummy user object `user = dummyUser`
            then save `user.save()`
            -> there has to be a better way

            ON UPDATING MULTIPLE SUBDOCUMENTS
            await User.findOneAndUpdate(
            //     {_id: dummyUser._id},
            //     //updates
            //     {
            //         $inc: {
            //             "accounts.$[primary].currentBalance": 200,
            //             "accounts.$[secondary].currentBalance": 350
            //         },
            //     },
            //     //arrayFilters
            //     {
            //         upsert: false,
            //         arrayFilters: [
            //             {"primary._id": mongoose.Types.ObjectId('635b0bffcc363d1950ba130a')},
            //             {"secondary._id": mongoose.Types.ObjectId('635b0c0ccc363d1950ba130f')}
            //         ]
            //     }
            // )

            CATEGORY
            if user.categories does not have category, create it.
            if category has an account attached, that account needs to
            have the transaction id pushed to its transactions and have its
            currentBalance incremented as well

            DEBIT vs. CREDIT
            incoming accountingType will determine where the accountId will go
            eg: {debit: accountId} for income to an asset account
            category will go into the opposite
            eg: {credit: categoryId} for the scenario above

            CATEGORIES ATTACHED TO ACCOUNTS
            if a Category is attached to an Account, that second account will
            need to have the transactionId pushed to its transactions array
            and increment/decrement its currentBalance as well

            ACCOUNT INCREMENTATION
            use req.user and req.params.accountId to do the necessary calculations before updating User document.
            1. instantiate new Transaction object
            2. calculate new account balance using req.user.account

            UPDATE THE USER
            use .findOneAndUpdate command to save changes.
            */
            
            //set body and primary accountId
            const body = req.body
            const primaryAccountId = req.params.accountId
            const dummyUser = req.user

            //set accounting actions
            const accountingAction = body.accountingType
            const otherAction = (accountingAction === 'debit' ? 'credit' : 'debit')

            //get primary account object
            // const primaryAccountIndex = dummyUser.accounts.findIndex(account => account._id == accountId)
            // const primaryAccount = dummyUser.accounts.filter(account => account._id == accountId)[0]

            // 



            // const newPush = {}

            // //CATEGORY
            // // if user.categories does not have category, create it.
            // let cleanCategory = body.category.trim()
            // let secondAccount = null
            // let secondAccountId = null
            // let secondAccountIndex = null
            // let categoryId = null
            // cleanCategory = cleanCategory[0].toUpperCase() + cleanCategory.slice(1).toLowerCase()
            // cleanCategory = cleanCategory.trim()
            // const foundCategory = user.categories.filter(category => category.name === cleanCategory)[0]
            // if (!foundCategory) {
            //     const newCategory = new Category({
            //         name: cleanCategory
            //     })
            //     newPush.categories = newCategory
            //     categoryId = newCategory._id
            // } else {
            //     if (foundCategory.account) {
            //         secondAccountId = foundCategory.account
            //         secondAccount = user.accounts.filter(account => account._id == secondAccountId)[0]
            //     }
            //     // // if category has an account attached, that account needs to
            //     // // have the transaction id pushed to its transactions and have its
            //     // // currentBalance incremented as well
            //     categoryId = foundCategory._id
            // }
            // if (secondAccount) secondAccountIndex = user.accounts.findIndex(account => account._id == secondAccountId)

            // // // 1. instantiate new Transaction object
            // const newTransaction = new Transaction({
            //     [accountingAction]: accountId,
            //     [otherAction]: categoryId,
            //     amount: body.amount
            // })

            // const newTransactionId = newTransaction._id

            // // // 2. push transactionId to .transactions array of, and 
            // // // increment each account that needs it

            // const accounts = [primaryAccount, secondAccount]

            // primaryAccount[`${accountingAction}s`].push(newTransactionId)
            // const newPrimaryBalance = Number(primaryAccount.currentBalance)
            // if (primaryAccount.balanceType === 'asset') {

            // } else if (primaryAccount.balanceType === 'liability') {
            // const dummyUser = req.user
            // req.user.userName = "changed from jesse"
            // user = dummyUser
            // await user.save()
            // }
            // const firstAccountPush = `first account ${primaryAccount.name} ${accountingAction}`
            // user.accounts[primaryAccountIndex][`${accountingAction}s`] = user.accounts[primaryAccountIndex][`${accountingAction}s`].concat(firstAccountPush)
            // console.log(firstAccountPush)
            // console.log(user.accounts[primaryAccountIndex][`${accountingAction}s`])
            // if (secondAccount) {
            //     const secondAccountPush = `second account ${secondAccount.name} ${otherAction}`
            //     user.accounts[secondAccountIndex][`${otherAction}s`].push(secondAccountPush)
            //     console.log(secondAccountPush)
            // }

            // user.save().then(savedUser => {
            //     savedUser === user
            // })
            // const actions = [accountingAction, otherAction]

            // for (let i = 0; i < actions.length; i++) {
            //     let foundAccount = user.accounts.filter(account => account._id == newTransaction[actions[i]])[0]
            //     if (!foundAccount) {
            //         const foundCategory = user.categories.filter(category => category._id == newTransaction[actions[i]])
            //         foundAccount = user.accounts.filter(account => account._id == foundCategory.account)[0]
            //     }
            //     if (foundAccount) {
            //         console.log(`pre changes`, foundAccount)
            //         // push newTransactionId to debits/credits array
            //         foundAccount[`${actions[i]}s`].push(newTransactionId)
            //         // increment/decrement account's currentBalance
            //         let newBalance = foundAccount.currentBalance
            //         console.log(newBalance)
            //         if (foundAccount.balanceType === 'asset') {
            //             //increment debit
            //             //decrement credit
            //             newBalance = Number(newBalance) + (actions[i] === 'debit' ? Number(newTransaction.amount) : Number(-newTransaction.amount))
            //         } else if (foundAccount.balanceType === 'liability') {
            //             //increment credit
            //             //decrement debit
            //             newBalance = Number(newBalance) + (actions[i] === 'credit' ? Number(newTransaction.amount) : Number(-newTransaction.amount))
            //         }
            //         console.log(newBalance)
            //         foundAccount.currentBalance = newBalance.toFixed(2)
            //     }
            //     console.log(`post changes`, foundAccount)
            // }

            // // use .findOneAndUpdate command to save changes.
            // await User.findOneAndUpdate({
            //     "accounts._id": mongoose.Types.ObjectId(accountId)
            // },
            // {
            //     $push: {
            //         "transactions": newTransaction,
            //         "accounts.$.transactions": mongoose.Types.ObjectId(newTransactionId)
            //     },
            //     $set: {
            //         "accounts.$.currentBalance": newBalance
            //     }
            // })

            res.redirect("/profile")

            //function for modifying account subdocuments
            //inputs: transaction object, account id string
            //outputs: account object
            // function addTransactionToAccounts(transactionObj, accountId) {
            //     const accountObj = user.accounts.filter(account => account._id == accountIdStr)[0]

            //     // // 1. calculate new account balance using req.user.account
            //     let newBalance = 0
            //     if (targetAccount.balanceType === 'asset') {
            //         if (accountingAction === 'debit') newBalance = currentBalance + transactionAmount
            //         else newBalance = currentBalance - transactionAmount
            //     } else {
            //         if (accountingAction === 'credit') newBalance = currentBalance + transactionAmount
            //         else newBalance = currentBalance - transactionAmount
            //     }
            //     newBalance = newBalance.toFixed(2)


                
            //     // // 2. push transactionId to account.transactions
                
            //     // // 3. increment/decrement account.currentBalance
            // }
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
};
