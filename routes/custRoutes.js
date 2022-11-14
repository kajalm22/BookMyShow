const express = require("express");
const {
  registerCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  loginUser,
} = require("../controller/custController");

const router = express.Router();

router.route("/register").post(registerCustomer);

router.route("/customers").get(getCustomers);

router.route("/customer/update/:id").put(updateCustomer);

router.route("/customer/delete/:id").delete(deleteCustomer);

router.route("/find").get(loginUser);

module.exports = router;
