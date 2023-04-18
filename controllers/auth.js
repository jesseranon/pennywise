const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Category = require("../models/Category")

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  const defaultCategories = [
    '639f8e02dbcddaf3a8d34972', // Rent/Mortgage
    '639f8e5adbcddaf3a8d34974', // Groceries
    '639f8e6bdbcddaf3a8d34975', // Entertainment
    '639f8eb0dbcddaf3a8d34976', // Primary job
    '639f8ebbdbcddaf3a8d34977', // Side hustle
    '639f8f0edbcddaf3a8d34978', // Interest charge
    '639f8f25dbcddaf3a8d34979', // Overdraft fee
    '639f8f32dbcddaf3a8d3497a', // Late payment fee
    '639f901bdbcddaf3a8d3497b', // Eating out
    '639f9057dbcddaf3a8d3497c', // Water utility
    '639f9074dbcddaf3a8d3497d', // Electric utility
    '639f907fdbcddaf3a8d3497e', // Phone service
    '639f909adbcddaf3a8d3497f', // Internet service
    '639f90aedbcddaf3a8d34980', // Car payment
    '639f90bddbcddaf3a8d34981', // Car insurance
    '639f94ffdbcddaf3a8d34982', // Car gas
    '639f9532dbcddaf3a8d34983', // School tuition
    '639f953bdbcddaf3a8d34984', // School supplies
    '639f9553dbcddaf3a8d34985', // Clothing
    '639f9570dbcddaf3a8d34986', // Hobbies
    '639fd8c76d615832eb8de071', // Doctor visit
    '639fd8e46d615832eb8de072', // Medication
  ]

  for (let i = 0; i < defaultCategories.length; i++) {
    const category = await Category.findOne(
      {_id: defaultCategories[i], user: null}
    )
    user.categories.push(category._id)
  }

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};
