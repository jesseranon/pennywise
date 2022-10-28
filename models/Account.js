const mongoose = require("mongoose")
const Transaction = require("./Transaction")

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: { //cash, savings, checking, credit card, etc.
        type: String,
        required: true,
    },
    balanceType: { //asset or liability
        type: String,
        required: true,
    },
    currentBalance: { 
        type: mongoose.Types.Decimal128,
        set: v => new mongoose.Types.Decimal128.fromString(parseFloat(v).toFixed(2)),
        get: v => parseFloat(v),
        required: true,
    },
    debits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    credits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Account', AccountSchema)