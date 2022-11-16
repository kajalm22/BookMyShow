const express = require("express");
const {
  addMovie,
  getMovies,
  updateMovies,
  deleteMovies,
  getOneMovie,
  populateMovies,
  getMoviesByProjection,
} = require("../controller/movieController");
const { getTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/add").post(addMovie);

router.route("/get").get(getMovies);

router.route("/update/:id").put(updateMovies);

router.route("/delete/:id").delete(deleteMovies);

router.route("/find").get(getOneMovie);

router.route("/getPopulatedMovie").get(populateMovies);

router.route("/getMoviesByProjection/:id").get(getMoviesByProjection);

module.exports = router;
