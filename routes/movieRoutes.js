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
  deletedMovies,
  findWithKeyword,
  projectMovies,
  saveMovies,
  paginationMovies,
  getByAxios,
  getByFetch,
  getPaginatedData,
 
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

router.route("/paginationUsingAggregate").get(paginationMovies)

router.route("/search/:key").get(findWithKeyword)

router.route("/getByAggregateprojection").get(projectMovies)

router.route("/saveMovies").post(saveMovies)

router.route("/getByAxios").get(getByAxios)

router.route("/getByFetch").get(getByFetch)

router.route("/getPaginatedData").get(getPaginatedData)

module.exports = router;
