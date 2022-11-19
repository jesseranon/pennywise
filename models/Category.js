const mongoose = require("mongoose")
const Account = require("./Account")
const User = require("./User")

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
});

module.exports = mongoose.model('Category', CategorySchema)