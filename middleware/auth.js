module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    console.log(`ensureGuest`)
    if (!req.isAuthenticated()) {
      console.log(`ensureGuest unauthenticated`)
      return next();
    } else {
      console.log(`ensureGuest authenticated`)
      res.redirect("/");
    }
  },
};
