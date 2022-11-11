const express = require("express");
const { newTheatre, getTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/theatre/home").post(newTheatre);

router.route("/theatres/lists").get(getTheatre);

module.exports = router;
