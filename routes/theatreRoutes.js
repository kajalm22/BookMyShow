const express = require("express");
const {
  getTheatre,
  addTheatre,
  updateTheatre,
  deleteTheatre,
} = require("../controller/theatreController");
const router = express.Router();

router.route("/home").post(addTheatre);

router.route("/lists").get(getTheatre);

router.route("/update/:id").put(updateTheatre);

router.route("/delete/:id").delete(deleteTheatre);

module.exports = router;
