const express = require("express");
const { newTheatre, getTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/theatre/create").post(newTheatre);

router.route("/theatres").post(getTheatre);

module.exports = router;
