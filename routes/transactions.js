const express = require("express");
const router = express.Router();
// const upload = require("../middleware/multer");
const accountsController = require("../controllers/accounts");
const transactionsController = require("../controllers/transactions")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// for using CRUD on *individual transactions*
//get
router.get("/:id", ensureAuth, transactionsController.getTransaction)
//put
router.put("/:id", transactionsController.modifyTransaction)
//delete
router.delete("/:id", transactionsController.deleteTransaction)

//get transaction form, pre-populate account paying from
router.get("/post/:accountId", transactionsController.displayTransactionForm)
//post transaction to account
router.post("/post/:accountId", transactionsController.postTransaction)

module.exports = router