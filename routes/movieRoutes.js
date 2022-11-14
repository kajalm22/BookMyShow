const express = require("express");
const {
  addMovie,
  getMovies,
  updateMovies,
  deleteMovies,
  getOneMovie,
} = require("../controller/movieController");
const { getTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/add").post(addMovie);

router.route("/get").get(getMovies);

router.route("/update/:id").put(updateMovies);

router.route("/delete/:id").delete(deleteMovies);

router.route("/find").get(getOneMovie);

module.exports = router;
