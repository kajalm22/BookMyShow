const asyncHandler = require("express-async-handler");
const Movies = require("../model/movieModel");

const addMovie = asyncHandler(async (req, res) => {
  const { title, description, releaseDate, duration, genre, amount, Theatre } =
    req.body;
  //   if (!req.body.text) {
  //     res.status(400);

  //     throw new Error("please add a movie name");
  //   }

  //   const newMovie = await Movies.create({
  //     title: req.body.title,
  //     description: req.body.description,
  //     releaseDate: req.body.releaseDate,
  //     duration: req.body.duration,
  //     genre: req.body.genre,
  //     amount: req.body.amount,
  //     theatre: req.body.theatre,
  //   });

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
      //   Theatre,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }

  res.status(200).json(newMovie);
});

module.exports = { addMovie };
