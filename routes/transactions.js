const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// for using CRUD on *individual transactions*
//get
router.get("/:id", ensureAuth, transactionsController.getTransaction)

//get transaction form, pre-populate account paying from
//get post/accountId to be removed after modal is implemented.
router.get("/create/:accountId", ensureAuth, transactionsController.getCreateTransactionForm)
router.post("/create/:accountId/:forecastId", ensureAuth, transactionsController.postTransaction)

//get update transaction form, pre-populate input fields with transaction data
//get update to be removed after modal is implemented.
router.get("/update/:transactionId", ensureAuth, transactionsController.getUpdateTransactionForm)
router.put("/update/:transactionId", ensureAuth, transactionsController.updateTransaction)

router.post("/delete/:id", ensureAuth, transactionsController.deleteTransaction)

module.exports = router