const express = require("express")
const { newBooking } = require("../controller/bookingController")
const router = express.Router()


router.route("/new").post(newBooking)



module.exports = router