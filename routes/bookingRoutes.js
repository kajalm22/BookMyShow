const express = require("express")

const { newBooking ,
     status ,
      totalAmount, deleteBooking, updateBooking, lastEntry} = require("../controller/bookingController")

const router = express.Router()


router.route("/new").post(newBooking)


router.route("/status").get(status)


router.route("/total").get(totalAmount)

router.route("/getLastEntry").get(lastEntry)

router.route("/delete/:id").delete(deleteBooking)

router.route("/update/:id").put(updateBooking)



module.exports = router