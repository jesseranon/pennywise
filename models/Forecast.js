const mongoose = require("mongoose")
const Category = require("./Category")
const User = require("./User")

const ForecastSchema = new mongoose.Schema({
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        set: v => new mongoose.Types.Decimal128.fromString(parseFloat(v).toFixed(2)),
        get: v => parseFloat(v),
        required: true
    },
    accountingType: {
        type: String,
        default: 'credit'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    date: {
        type: Date,
        //may need to set getter to add a timezone offset when forecast date is requested.
        default: null,
    },
    interval:  {
        type: Number,
        default: null
    },
    installments: {
        type: Number,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("Forecast", ForecastSchema);