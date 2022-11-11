const express = require("express");
const { addMovie } = require("../controller/movieController");
const router = express.Router();

router.route("/add").post(addMovie);

module.exports = router;
