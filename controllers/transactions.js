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
            //     //the query
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

            ON UPDATING A SINGLE SUBDOCUMENT
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
            const dummyUser = req.user
            
            //get primary account object
            // const primaryAccountIndex = dummyUser.accounts.findIndex(account => account._id == accountId)
            const primaryAccountId = req.params.accountId
            const primaryAccount = dummyUser.accounts.filter(account => account._id == primaryAccountId)[0]
            
            //initiate mongoose update action objects
            const query = {}
            const push = {}

            // //CATEGORY & secondAccount
            // // if user.categories does not have the incoming category, create it.
            let cleanIncomingCategory = body.category.trim()
            cleanIncomingCategory = cleanIncomingCategory[0].toUpperCase() + cleanIncomingCategory.slice(1).toLowerCase()
            // console.log(cleanCategory)
            // instantiate secondAccount variables
            let secondAccountId = null
            let secondAccount = null
            // instantiate categoryId variable
            let categoryId = null
            // find the category by name using cleanCategory
            const foundCategory = dummyUser.categories.filter(category => {
                let cleanCategory = category.name[0].toUpperCase() + category.name.slice(1).toLowerCase()
                return cleanCategory === cleanIncomingCategory
            })[0]
            console.log(foundCategory)
            if (!foundCategory) { //if a category isn't found
                //create a new category
                const newCategory = new Category({
                    name: cleanIncomingCategory
                })
                //add to user categories by
                //adding categories: newCategory to mongoose $push update
                push.categories = newCategory
                categoryId = newCategory._id
            } else { //if a category is found
                if (foundCategory.account) { //if its account property isn't null
                    secondAccountId = foundCategory.account.toString() //set secondAccountId and use it to pull up the secondAccount object
                    console.log(typeof secondAccountId)
                    // console.log(dummyUser.accounts.filter(account => account._id == '635b0c0ccc363d1950ba130f'))
                    secondAccount = dummyUser.accounts.filter(account => account._id == secondAccountId)[0]
                    console.log("secondAccount", secondAccount)
                }
                // // if category has an account attached, that account needs to
                // // have the transaction id pushed to its transactions and have its
                // // currentBalance incremented as well
                categoryId = foundCategory._id
            }

            //set accounting actions
            const accountingAction = body.accountingType
            const otherAction = (accountingAction === 'debit' ? 'credit' : 'debit')

            // // // 1. instantiate new Transaction object
            const newTransaction = new Transaction({
                [accountingAction]: mongoose.Types.ObjectId(primaryAccountId),
                [otherAction]: mongoose.Types.ObjectId(categoryId),
                amount: body.amount
            })
            // add to user transactions by
            // adding transactions: newTransaction to the mongoose $push update
            push.transactions = newTransaction

            const newTransactionId = newTransaction._id

            // // // 2. push transactionId to .transactions array of, and 
            // // // increment each account that needs it

            // newPrimaryBalance will be used to 
            let primaryAccountUpdate = null
            let secondAccountUpdate = null
            // set up primaryAccountUpdate to use increment/decrement
            const updateAmount = Number(body.amount)
            if (primaryAccount.balanceType === 'asset') {
                //increment debit
                //decrement credit
                primaryAccountUpdate = (accountingAction === 'debit' ? updateAmount : -updateAmount)
            } else {
                //increment credit
                //decrement debit
                primaryAccountUpdate = (accountingAction === 'credit' ? updateAmount : -updateAmount)
            }

            let arrayFilters = null
            let primaryAccountUpdateBalance = null
            const update = {}
            const inc = {}
            
            if (secondAccount) { //if secondAccount is found
                // set up mongoose query object for multiple subdocuments
                query._id = dummyUser._id
                // set up mongoose update for multiple subdocument updates
                // // each account should have the newTransactionId pushed to its
                // // appropriate accounting array (debit/credit)
                const primaryAccountPushString = `accounts.$[primary].${accountingAction}s`
                const secondAccountPushString = `accounts.$[secondary].${otherAction}s`
                push[primaryAccountPushString] = newTransaction._id
                push[secondAccountPushString] = newTransaction._id
                // // each account's currentBalance should be properly incremented/decremented
                secondAccountUpdate = (primaryAccountUpdate < 0 ? -updateAmount : updateAmount)
                primaryAccountUpdateBalance = {
                    "accounts.$[primary].currentBalance": primaryAccountUpdate
                }
                const secondaryAccountUpdateBalance = {
                    "accounts.$[secondary].currentBalance": secondAccountUpdate
                }
                update["$push"] = push
                update["$inc"] = {}
                update["$inc"]["accounts.$[primary].currentBalance"] = primaryAccountUpdate
                update["$inc"]["accounts.$[secondary].currentBalance"] = secondAccountUpdate
                // set up mongoose arrayFilters
                const arrayFilters = {
                    upsert: false,
                    arrayFilters: [
                        {"primary._id": mongoose.Types.ObjectId(primaryAccountId)},
                        {"secondary._id": mongoose.Types.ObjectId(secondAccountId)}
                    ]
                }

                await User.findOneAndUpdate(
                    //the query
                    query,
                    //updates
                    update,
                    //arrayFilters
                    arrayFilters
                )
            } else { //if only primaryAccount is found
                // set up mongoose update for a single subdocument update
                query["accounts._id"] = mongoose.Types.ObjectId(primaryAccountId)
                // // account should have newTransactionId pushed to its appropriate account (debit/credit)
                const accountTransactionPushString = `accounts.$.${accountingAction}s`
                push[accountTransactionPushString] = mongoose.Types.ObjectId(newTransactionId)
                // // account's currentBalance should be properly incremented/decremented
                primaryAccountUpdateBalance = {
                    "accounts.$.currentBalance": primaryAccountUpdate
                }
                update["$push"] = push
                update["$inc"] = primaryAccountUpdateBalance

                // // use .findOneAndUpdate command to save changes.
                await User.findOneAndUpdate(
                    query,
                    update
                )
            }
            res.redirect("/profile")
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
};
