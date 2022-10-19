const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

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

exports.postSignup = (req, res, next) => {
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

  const defaultCategories = [
    {
      name: 'rent',
      subCategory: 'housing'
    },
    {
      name: 'mortgage',
      subCategory: 'housing'
    },
    {
      name: 'water',
      subCategory: 'utilities'
    },
    {
      name: 'electric',
      subCategory: 'utilities'
    },
    {
      name: 'sewer',
      subCategory: 'utilities'
    },
    {
      name: 'cable',
      subCategory: 'utilities'
    },
    {
      name: 'internet',
      subCategory: 'utilities'
    },
    {
      name: 'phone',
      subCategory: 'utilities'
    },
    {
      name: 'garbage',
      subCategory: 'utilities'
    },
    {
      name: 'natural gas',
      subCategory: 'utilities'
    },
    {
      name: 'gas',
      subCategory: 'transportation'
    },
    {
      name: 'car payment',
      subCategory: 'transportation'
    },
    {
      name: 'car insurance',
      subCategory: 'transportation'
    },
    {
      name: 'bus pass',
      subCategory: 'transportation'
    },
    {
      name: 'bus fare',
      subCategory: 'transportation'
    },
    {
      name: 'salary',
      subCategory: 'job'
    },
    {
      name: 'paycheck',
      subCategory: 'job'
    },
    {
      name: 'commission',
      subCategory: 'job'
    },
    {
      name: 'medication',
      subCategory: 'medical'
    },
    {
      name: 'doctor visit copay',
      subCategory: 'medical'
    },
    {
      name: 'medical bill',
      subCategory: 'medical'
    },
  ]

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    categories: defaultCategories
  });

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
