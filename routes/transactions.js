const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// for using CRUD on *individual transactions*
//get
router.get("/:id", ensureAuth, transactionsController.getTransaction)

//get transaction form, pre-populate account paying from
router.get("/post/:accountId", transactionsController.getCreateTransactionForm)
router.post("/post/:accountId/:forecastId", transactionsController.postTransaction)

//get update transaction form, pre-populate input fields with transaction data
router.get("/update/:transactionId", transactionsController.getUpdateTransactionForm)
router.post("/update/:transactionId", transactionsController.updateTransaction)

router.post("/deleteTransaction/:id", transactionsController.deleteTransaction)

module.exports = router