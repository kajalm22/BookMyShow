const express = require("express");
const {
  registerCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controller/custController");

const router = express.Router();

router.route("/register").post(registerCustomer);

router.route("/customers").get(getCustomers);

router.route("/update/:id").put(updateCustomer);

router.route("/delete/:id").delete(deleteCustomer);

module.exports = router;
