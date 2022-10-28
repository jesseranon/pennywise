const mongoose = require("mongoose")
const Account = require("./Account")

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
    }
});

module.exports = mongoose.model('Category', CategorySchema)