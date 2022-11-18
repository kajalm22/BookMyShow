const express = require("express");
const {
  addMovie,
  getMovies,
  updateMovies,
  getOneMovie,
  populateMovies,
  getMoviesByProjection,
  aggregatePagination,
  addMultiple,
  // deletedMovie,
  deletedMovies,
  findWithKeyword,
} = require("../controller/movieController");
const { getTheatre } = require("../controller/theatreController");
const router = express.Router();

router.route("/add").post(addMovie);

router.route("/get").get(getMovies);

router.route("/update/:id").put(updateMovies);

router.route("/delete/:id").delete(deletedMovies);

router.route("/find").get(getOneMovie);

router.route("/getPopulatedMovie").get(populateMovies);

router.route("/getMoviesByProjection/:id").get(getMoviesByProjection);

router.route("/aggregatePagination").get(aggregatePagination);

router.route("/addMultiple").post(addMultiple);

router.route("/search/:key").get(findWithKeyword)

module.exports = router;
