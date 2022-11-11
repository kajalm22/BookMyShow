const express = require("express");
const { addMovie } = require("../controller/movieController");
const { getTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/add").post(addMovie);

module.exports = router;
