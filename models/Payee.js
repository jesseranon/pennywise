const mongoose = require("mongoose")
const Category = require("./Category")

const PayeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: "Unspecified"
    }
});

module.exports = mongoose.model('Payee', PayeeSchema)