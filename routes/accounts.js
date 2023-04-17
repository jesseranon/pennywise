const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const accountsController = require("../controllers/accounts");
const transactionsController = require("../controllers/transactions");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Account Routes - simplified for now
// post account
//get createAccount to be removed after modal is implemented.
// router.get("/create", ensureAuth, accountsController.getCreateAccountForm)
router.post("/create", ensureAuth, accountsController.createAccount)

// get account
router.get("/:id", ensureAuth, accountsController.getAccount)

// delete account
router.post("/delete/:id", ensureAuth, accountsController.deleteAccount)

// modify account details
//get updateAccount to be removed after modal is implemented.
router.get("/update/:id", ensureAuth, accountsController.getUpdateAccountForm)
router.post("/update/:id", ensureAuth, accountsController.updateAccount)

// update account - this doesn't need to be an option i don't think

// post customCategory
// get customCategory
// put customCategory
// delete customCategory

// post forecast
// get forecast
// put forecast
// delete forecast

//Added route for creating a comment.
//Added here because comments are added via Post page.
// router.post('/postTransaction/:id', transactionsController.postTransaction);

module.exports = router