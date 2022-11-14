const express = require("express");
const {
  getTheatre,
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getOneTheatre,
} = require("../controller/theatreController");
const router = express.Router();

router.route("/home").post(addTheatre);

router.route("/lists").get(getTheatre);

router.route("/update/:id").put(updateTheatre);

router.route("/delete/:id").delete(deleteTheatre);

router.route("/find").get(getOneTheatre);

module.exports = router;
