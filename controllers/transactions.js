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
        const targetTransactionId = req.params.id
        const userId = req.user._id
        try {
            const accounts = Account.find({
                user: userId,
                $or: [
                    {debits: targetTransactionId},
                    {credits: targetTransactionId}
                ]
            }).exec()
            
            const targetTransaction = await Transaction.find({
                user: userId,
                _id: targetTransactionId
            })
            
            const transactionAmount = targetTransaction.amount
            
            accounts.then(accounts => {
                console.log(`hello from transactionsController.deleteTransaction - accounts promise`)
                accounts.forEach(async account => {
                    console.log(`Account: ${account._id}`)
                    console.log('debits', account.debits)
                    console.log('credits', account.credits)
                    let transactionType = (account.debits.find(id => id == targetTransactionId) ? 'debits' : 'credits')
                    // console.log(`transaction type`, transactionType)
                    let accountCurrentBalance = account.currentBalance
                    const accountType = account.balanceType
                    
                    // 1. remove from any accounts that contain it in their debits or credits
                    if (transactionType === 'debits') {
                        account.debits = account.debits.filter(d => d._id != targetTransactionId)
                    } else {
                        account.credits = account.credits.filter(c => c._id != targetTransactionId)
                    } 
                    
                    // 1.5 increment/decrement account by transaction amount
                    if (accountType === 'asset') {
                        // inc/dec by transaction amount
                        if (transactionType === 'debit') account.currentBalance = Number(accountCurrentBalance) - Number(transactionAmount)
                        else account.currentBalance = Number(accountCurrentBalance) + Number(transactionAmount)
                    } else {
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
            
            console.log(`transaction delete requested for transaction ${req.params.id}`)
            res.redirect(req.get('referer'))
            
        } catch (err) {
            console.log(err)
            res.redirect("/profile")
        }
    },
    postTransaction: async (req, res) => {
        // console.log(`hello from postTransaction in transactions controller`)
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
                if (accountAction === 'debits') {
                    mainAccount.currentBalance = Number(currentBalance) - Number(newTransaction.amount)
                }
                else mainAccount.currentBalance = Number(currentBalance) + Number(newTransaction.amount) 
            }
            await mainAccount.save()

            // if category is associated with an account,
            // push transactionId to the category.account
            console.log(category.account, accountAction)
            if (category.account) {
                const accountOtherAction = (accountAction === 'debits' ? 'credits' : 'debits')
                const secondAccount = await Account.findOne({_id: category.account, user: req.user._id})
                console.log(secondAccount, accountOtherAction)
                secondAccount[accountOtherAction].push(transactionId)
                // push newTransaction._id to secondAccount[accountOtherAction]
                const secondCurrentBalance = secondAccount.currentBalance
                if (secondAccount.balanceType === 'asset') {
                    if (accountOtherAction === 'debits') {
                        secondAccount.currentBalance = Number(secondCurrentBalance) + Number(newTransaction.amount)
                    }
                    else secondAccount.currentBalance = Number(secondCurrentBalance) - Number(newTransaction.amount)
                } else if (secondAccount.balanceType === 'liability') {
                    if (accountOtherAction === 'debits') {
                        secondAccount.currentBalance = Number(secondCurrentBalance) - Number(newTransaction.amount)
                    }
                    else secondAccount.currentBalance = Number(secondCurrentBalance) + Number(newTransaction.amount) 
                }
                await secondAccount.save()
            }

            await User.findOneAndUpdate(
                {_id: user},
                {
                    $push: {
                        transactions: transactionId
                    }
                }
            )
            res.redirect("/profile")
        } catch (err) {
            console.error(err)
            res.redirect("/profile")
        }
    },
};
