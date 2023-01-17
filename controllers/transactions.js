const mongoose = require("mongoose")
const Account = require("../models/Account")
const Category = require("../models/Category")
const Forecast = require("../models/Forecast")
const Transaction = require("../models/Transaction")
const User = require("../models/User")

const accountsController = require("./accounts")
const categoriesController = require("./categories")

module.exports = {
    getCreateTransactionForm: async (req, res) => {
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
            res.render("transactionForm.ejs", {user: user, mode: 'create', account: account})
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
    getUpdateTransactionForm: async (req, res) => {
        //send up the update transaction form
        const transactionId = req.params.transactionId
        const userId = req.user.id
        try {
            //stuff
            console.log(`hello from getUpdateTransactionForm`)
            const transaction = await Transaction.findOne({
                user: userId,
                _id: transactionId
            })
                .populate({
                    path: 'user',
                    populate: {
                        path: 'categories',
                        model: 'Category'
                    }
                })
                .populate('category')

            // console.log(transaction)
            res.render('transactionForm.ejs', {user: transaction.user,  mode: 'edit', transaction})
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
    // TODO: re-order create, update, delete functions
    updateTransaction: async (req, res) => {
        //modify a single transaction's details
        console.log(`transaction modification requested for transaction ${req.params.transactionId}`)
        try {
            const userId = req.user._id

            // console.log(req.body.amount)
            // console.log(req.body.category)

            const targetTransaction = await Transaction.findOne({
                user: req.user._id,
                _id: req.params.transactionId
            }).populate('category')

            // check to see if category is changed
            const originalCategory = targetTransaction.category.name
            const newCategory = req.body.category
            // if it is...
            if (originalCategory != newCategory) {
                // run categoriesController.checkCategory on newCategory
                // set targetTransaction.category to newCategory._id
                console.log(`category has changed from ${originalCategory} to ${newCategory}`)
                const foundCategory = await categoriesController.checkCategory(userId, newCategory)
                targetTransaction.category = foundCategory._id
                // await targetTransaction.save()
            }

            // check to see if amount is changed
            const originalAmount = Number(targetTransaction.amount)
            const newAmount = Number(req.body.amount)

            let amountChange = null

            if (originalAmount != newAmount) {
                /*
                    if newAmount > originalAmount, change is positive
                    if newAmount < originalAmount, change is negative
                */
                amountChange = newAmount - originalAmount
                // change targetTransaction.amount to newAmount
                targetTransaction.amount = newAmount
                // save targetTransaction
                await targetTransaction.save()
                console.log(`amount has changed from ${originalAmount} to ${newAmount}.`)
                console.log(`a difference of ${amountChange}`)
                // find accounts affected by this transaction change
                const accounts = Account.find({
                    user: userId,
                    $or: [
                        {debits: targetTransaction._id},
                        {credits: targetTransaction._id}
                    ]
                }).exec()

                accounts.then(accounts => {
                    accounts.forEach(account => {
                        console.log(account.currentBalance)
                        const accountType = account.balanceType
                        const accountAction = (account.debits.find(d => d === targetTransaction._id.toString()) ? 'debits' : 'credits')
                        
                        if (accountType === 'asset' && accountAction === 'credits') amountChange = -amountChange
                        if (accountType === 'liability' && accountAction === 'debits') amountChange = -amountChange

                        const newBalance = module.exports.incrementAccountCurrentBalance(account.currentBalance, amountChange)
                        account.currentBalance = newBalance

                        account.save()
                    })
                })
                // increment their currentBalance according to the new change
            }

        } catch (err) {
            console.log(err)
        }
        res.redirect("/profile")
    },
    deleteTransaction: async (req, res) => {
        //delete a single transaction
        const targetTransactionId = req.params.id
        const userId = req.user._id

        console.log(`transaction delete requested for transaction ${req.params.id}`)
        console.log(`user: ${req.user._id}`)
        try {
            const accounts = Account.find({
                user: userId,
                $or: [
                    {debits: targetTransactionId},
                    {credits: targetTransactionId}
                ]
            }).populate('debits').populate('credits').exec()

            const targetTransaction = await Transaction.findOne({
                user: userId,
                _id: targetTransactionId
            })

            // console.log('target transaction: ')
            // console.log(targetTransaction)
            // console.log(targetTransaction)

            const transactionAmount = targetTransaction.amount
            // console.log(`target transaction amount: ${transactionAmount}`)

            accounts.then(accounts => {
                console.log(`hello from transactionsController.deleteTransaction - accounts promise`)
                accounts.forEach(async account => {
                    console.log(`Account: ${account._id}`)
                    console.log(`Current balance: ${account.currentBalance}`)
                    // console.log('debits', account.debits)
                    // console.log('credits', account.credits)
                    console.log(`transaction amount reversing: ${transactionAmount}`)
                    let transactionType = (account.debits.find(d => d._id == targetTransactionId) ? 'debits' : 'credits')
                    console.log(`running find on account debits for targetTransactionId`)
                    console.log(account.debits.find(d => d._id == targetTransactionId))
                    console.log(`transaction type`, transactionType)
                    let accountCurrentBalance = account.currentBalance
                    const accountType = account.balanceType
                    console.log(`account type: ${accountType}`)

                    // 1. remove from any accounts that contain it in their debits or credits
                    if (transactionType === 'debits') {
                        account.debits = account.debits.filter(d => d._id != targetTransactionId)
                    } else {
                        account.credits = account.credits.filter(c => c._id != targetTransactionId)
                    }

                    // // 1.5 increment/decrement account by transaction amount
                    if (accountType === 'asset') {
                    //     // inc/dec by transaction amount
                        console.log(`account is an asset account`)
                        if (transactionType === 'debits') {
                            console.log(`deleting this transaction should reduce the currentBalance`)
                            account.currentBalance = Number(accountCurrentBalance) - Number(transactionAmount)
                        } else {
                            console.log(`deleting this transaction should increase the currentBalance`)
                            account.currentBalance = Number(accountCurrentBalance) + Number(transactionAmount)
                        }
                    } else {
                        console.log(`account is a liability account`)
                        if (transactionType === 'debit') account.currentBalance = Number(accountCurrentBalance) + Number(transactionAmount)
                        else account.currentBalance = Number(accountCurrentBalance) - Number(transactionAmount)
                    }

                    await account.save()
                })
            }).catch(err => {
                console.log(err)
                res.redirect(req.get('referer'))
            })

            // 2. remove from user's transactions
            const updatedTransactions = req.user.transactions.filter(t => t._id != targetTransactionId)
            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set:
                    {
                        transactions: updatedTransactions
                    }
                }
            )

            // 3. delete transaction from db
            await Transaction.deleteOne({
                user: req.user._id,
                _id: targetTransactionId
            })

            res.redirect(req.get('referer'))

        } catch (err) {
            console.log(err)
            res.redirect("/profile")
        }
    },
    // TODO: rename to createTransaction
    postTransaction: async (req, res) => {
        console.log(`hello from postTransaction in transactions controller`)
        console.log(req.body)

        try {
            const accountAction = req.body.accountingType
            const accountId = req.params.accountId

            // check if the category exists
            let category = await categoriesController.checkCategory(req.user._id, req.body.category)

            const categoryId = category._id
            const user = req.user._id

            // set newTransaction params
            const amount = req.body.amount

            // create newTransaction
            const newTransaction = new Transaction({
                amount,
                category: categoryId,
                user
            })
            await newTransaction.save()

            const mainAccount = await Account.findOne(
                {
                    _id: accountId,
                    user
                }
            )
            // // push newTransaction._id to mainAccount[accountAction]
            // console.log(`main account`)
            // console.log(mainAccount)
            // console.log(accountAction)

            await module.exports.postTransactionToAccount(mainAccount._id, newTransaction._id, user, accountAction)

            // if category is associated with an account,
            // push transactionId to the category.account
            if (category.account) {
                // console.log(category.account, accountAction)
                const accountOtherAction = (accountAction === 'debits' ? 'credits' : 'debits')
                const secondAccount = await Account.findOne({_id: category.account, user: req.user._id})
                // console.log(secondAccount, accountOtherAction)
                await module.exports.postTransactionToAccount(secondAccount._id, newTransaction._id, user, accountOtherAction)
            }

            const userDoc = await User.findOneAndUpdate({
                _id: user
            })

            userDoc.transactions.push(newTransaction._id)

            if (req.params.forecastId != 'null') {
                const forecastId = req.params.forecastId
                userDoc.forecasts = userDoc.forecasts.filter(f => f != forecastId)
                console.log(userDoc.forecasts)
                await Forecast.findOneAndDelete({
                    user: user,
                    _id: forecastId
                })
            }

            await userDoc.save()

            res.redirect("/profile")
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
    postTransactionToAccount: async (accountId, transactionId, userId, accountAction = 'debits') => {
        // helper function to post transactionId to account.debits/account.credits
        // calls the helper function to increment account.currentBalance
        console.log(`postTransactionToAccount function`)
        try {
            const accountDoc = await Account.findOne({
                user: userId,
                _id: accountId
            })

            const transactionDoc = await Transaction.findOne({
                user: userId,
                _id: transactionId
            })

            // console.log(`posting transaction ${transactionDoc}`)
            // console.log(`to account ${accountDoc}`)
            // console.log(`account currentBalance`, accountDoc.currentBalance)
            let transactionAmount = Number(transactionDoc.amount)
            // console.log(`transaction amount`, transactionAmount)
            // console.log(`accountAction`, accountAction)
            // console.log(`transactionAmount`, transactionAmount)

            if (accountDoc.balanceType === 'asset' && accountAction === 'credits') {
                transactionAmount = -transactionAmount
            } else if (accountDoc.balanceType === 'liability' && accountAction === 'debits')  {
                transactionAmount = -transactionAmount
            }

            accountDoc[accountAction].push(transactionDoc._id)

            accountDoc.currentBalance = module.exports.incrementAccountCurrentBalance(Number(accountDoc.currentBalance), transactionAmount)

            await accountDoc.save()
        } catch (err) {
            console.log(err)
        }
    },
    incrementAccountCurrentBalance: (accountCurrentBalance, incrementNumber) => {
        // helper function that increments account.currentBalance
        const incrementation = accountCurrentBalance + incrementNumber
        return incrementation
    }
};
