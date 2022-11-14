const asyncHandler = require("express-async-handler");
const Movies = require("../model/movieModel");
const theatreModel = require("../model/theatreModel");
const Theatre = require("../model/theatreModel");

const addMovie = asyncHandler(async (req, res) => {
  const { title, description, releaseDate, duration, genre, amount, Theatre } =
    req.body;
  // if (!req.body.text) {
  //   res.status(400);

  //   throw new Error("please add a movie name");
  // }

  const newMovie = await Movies.create({
    title,
    description,
    releaseDate,
    genre,
    duration,
    amount,
    //Theatre,
  });

  if (newMovie) {
    res.status(201).json({
      message: "Movie has been added successfully",
      title,
      description,
      releaseDate,
      genre,
      duration,
      amount,
      Theatre,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
  //res.status(200).json(newMovie);
});

const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movies.find();
  res.status(200).json(movies);
});

const updateMovies = asyncHandler(async (req, res) => {
  const movies = await Movies.findById(req.params.id);

  if (!movies) {
    res.status(400);

    throw new Error("Movie not found. Please the given Movie ID ");
  }

  const updatedMovie = await Movies.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (updatedMovie) {
    res.status(200).json(updatedMovie);
  } else {
    res.status(400);

    throw new Error("Movie details could not be updated!");
  }
});

const deleteMovies = asyncHandler(async (req, res) => {
  const movies = await Movies.findById(req.params.id);

  if (!movies) {
    res.status(400);

    throw new Error("Movie not found. Please check the Movie Id given");
  }

  const deletedMovie = await Movies.remove();
  res.status(200).json({ message: "Movie details have been now deleted!" });
});
module.exports = { addMovie, getMovies, updateMovies, deleteMovies };
