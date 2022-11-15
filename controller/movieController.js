const asyncHandler = require("express-async-handler");
const Movies = require("../model/movieModel");
const Theatre = require("../model/theatreModel");
const Ajv = require("ajv");
const ajv = new Ajv();

const addMovie = asyncHandler(async (req, res) => {
  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      releaseDate: { type: "date" },
      duration: { type: "number" },
      genre: { type: "array" },
      amount: { type: "number" },
    },
    required: [
      "title ",
      "description",
      "releaseDate",
      " duration",
      "genre",
      "amount",
    ],
    //additionalProperties: false,
  };

  const validate = ajv.compile(schema);

  const valid = validate(req.body);

  if (!valid) {
    console.log(validate.errors);
    res.status(400).json({ err: validate.errors });
  }
  //to validate schema using ajv , send data in raw json , not body urlencoded

  const { title, description, releaseDate, duration, genre, amount } = req.body;

  const newMovie = await Movies.create({
    title,
    description,
    releaseDate,
    genre,
    duration,
    amount,
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
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
  //res.status(200).json(newMovie);
});

const getOneMovie = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const movie = await Movies.findOne({ title });
  res.status(200).json(movie);
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

  const deletedMovie = await Movies.deleteOne();
  res.status(200).json({ message: "Movie details have been now deleted!" });
});
module.exports = {
  addMovie,
  getMovies,
  updateMovies,
  deleteMovies,
  getOneMovie,
};
