const express = require("express")
// const { status } = require("express/lib/response")
const { newBooking , status , totalAmount, deleteBooking, updateBooking} = require("../controller/bookingController")
// const { totalAmount } = require("../controller/paymentController")
const router = express.Router()


router.route("/new").post(newBooking)


router.route("/status").get(status)


router.route("/total").get(totalAmount)

router.route("/delete/:id").delete(deleteBooking)

router.route("/update/:id").put(updateBooking)



module.exports = router