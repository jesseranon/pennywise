const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// for using CRUD on *individual transactions*
//get
router.get("/:id", ensureAuth, transactionsController.getTransaction)

//get transaction form, pre-populate account paying from
router.get("/post/:accountId", ensureAuth, transactionsController.getCreateTransactionForm)
router.post("/post/:accountId/:forecastId", ensureAuth, transactionsController.postTransaction)

//get update transaction form, pre-populate input fields with transaction data
router.get("/update/:transactionId", ensureAuth, transactionsController.getUpdateTransactionForm)
router.put("/update/:transactionId", ensureAuth, transactionsController.updateTransaction)

router.delete("/deleteTransaction/:id", ensureAuth, transactionsController.deleteTransaction)

module.exports = router