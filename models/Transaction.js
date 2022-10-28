const mongoose = require("mongoose")
const Account = require("./Account")
const Payee = require("./Payee")

const TransactionSchema = new mongoose.Schema({
    debit: { // accountId or categoryId
        type: String,
        required: true,
    },
    credit: { // accountId or categoryId
        type: String,
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Transaction', TransactionSchema)