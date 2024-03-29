const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const Account = require("./Account")
const Category = require("./Category")
const Forecast = require("./Forecast")
const Transaction = require("./Transaction")

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  currency: {
        type: String,
        default: "$"
  },
  accounts: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: "Account"
  }],
  forecasts: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: "Forecast"
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: "Transaction"
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: "Category"
  }],
});


// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema)