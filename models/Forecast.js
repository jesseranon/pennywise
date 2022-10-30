const mongoose = require("mongoose")
const Payee = require("./Payee")

const ForecastSchema = new mongoose.Schema({
    accountingType: {
        type: String,
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        set: v => new mongoose.Types.Decimal128.fromString(parseFloat(v).toFixed(2)),
        get: v => parseFloat(v),
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