const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const accountsController = require("../controllers/accounts");
const userController = require("../controllers/user");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", ensureGuest, authController.getSignup);
router.post("/signup", authController.postSignup);

//profile/dashboard
router.get("/profile", ensureAuth, userController.getProfile);
router.get("/profile/accounts", ensureAuth, userController.getAccounts);
router.get("/profile/categories", ensureAuth, userController.getCategories);

module.exports = router;