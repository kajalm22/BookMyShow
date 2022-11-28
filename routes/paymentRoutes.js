const express = require("express")
const { status, newPayment } = require("../controller/paymentController")
const router = express.Router()


router.route("/new").post(newPayment)

router.route("/status").get(status)


module.exports = router