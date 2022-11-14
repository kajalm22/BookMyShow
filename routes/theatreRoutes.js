const express = require("express");
const { getTheatre, addTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/home").post(addTheatre);

router.route("/lists").get(getTheatre);

module.exports = router;
