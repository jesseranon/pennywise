const mongoose = require("mongoose")
const User = require("./User")
const Category = require("./Category")

const transactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0,

  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const AccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  accountSubType: {
    type: String,
    required: true,
  },
  currentBalance: {
    type: mongoose.Types.Decimal128,
    set: v => new mongoose.Types.Decimal128.fromString(v),
    required: true,
  },
  users: {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    linkedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  transactions: [transactionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Account", AccountSchema);