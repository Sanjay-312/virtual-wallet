const express = require("express")
const router = express.Router()
const walletController =  require("./walletController")

router.post("/deposit", walletController.deposit)
router.post("/payout", walletController.payout)
router.get("/balance/:userId", walletController.getBallence)
router.get('/history/:userId',walletController.getHistory)

module.exports = router