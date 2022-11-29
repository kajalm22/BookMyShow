const express = require("express")
// const { status } = require("express/lib/response")
const { newBooking , status } = require("../controller/bookingController")
const router = express.Router()


router.route("/new").post(newBooking)


router.route("/status").get(status)



module.exports = router