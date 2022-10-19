const Account = require("../models/Account")
const User = require("../models/User")
const { Decimal128 } = require("mongoose")

module.exports = {
    displayTransactionForm: async (req, res) => {
        //send up the transaction form
        const accountId = req.params.accountId
        const userId = req.user._id
        try {
            const user = await User.findOne({ _id: userId })
            const account = await Account.findOne({ _id: accountId}).populate("transactions")
            console.log(`transaction form requested for account ${req.params.accountId}`)
            res.render("transactionform.ejs", {user: user, account: account}) 
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
        //post transaction to account from transaction form
        const accountId = req.params.accountId
        console.log(accountId)
        res.redirect("/profile")
        // try {
        //   await Account.findOneAndUpdate(
        //     { _id: req.params.id },
        //     {
        //       $inc: { likes: 1 },
        //     }
        //   );
        //   console.log("Likes +1");
        //   res.redirect(`/post/${req.params.id}`);
        // } catch (err) {
        //   console.log(err);
        // }
    },
};
