const mongoose = require("mongoose")
const Account = require("./Account")
const Category = require("./Category")
const User = require("./User")

const TransactionSchema = new mongoose.Schema({
    // debit: { // accountId or categoryId
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     refPath: 'acctModel'
    // },
    // credit: { // accountId or categoryId
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     refPath: 'acctModel'
    // },
    // tModel: {
    //     type: String,
    //     required: true,
    //     enum: ['Account', 'Category']
    // },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        set: v => new mongoose.Types.Decimal128.fromString(parseFloat(v).toFixed(2)),
        get: v => parseFloat(v),
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Transaction', TransactionSchema)