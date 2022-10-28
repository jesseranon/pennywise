const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const accountsController = require("../controllers/accounts");
const transactionsController = require("../controllers/transactions");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Account Routes - simplified for now
// post account
router.post("/createAccount", accountsController.postAccount)
// get account
router.get("/:id", ensureAuth, accountsController.getAccount)
// delete account
router.delete("/deleteAccount/:id", accountsController.deleteAccount)
// modify account details
router.put("modifyAccount/:id", accountsController.modifyAccount)

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