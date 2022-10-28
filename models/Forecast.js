const mongoose = require("mongoose")
const Payee = require("./Payee")

const ForecastSchema = new mongoose.Schema({
    accountingType: {
        type: String,
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    category: {
        type: String,
        default: "Uncategorized"
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Forecast", ForecastSchema);