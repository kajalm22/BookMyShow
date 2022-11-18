const asyncHandler = require("express-async-handler");
const Movies = require("../model/movieModel");
const Theatre = require("../model/theatreModel");
const mongoose = require("mongoose");
const Ajv = require("ajv");
const { all } = require("../routes/movieRoutes");
//const { ObjectID } = require("bson");
//const { populate } = require("../model/theatreModel");
const ajv = new Ajv();

const addMovie = asyncHandler(async (req, res) => {
  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      releaseDate: { type: "string" },
      duration: { type: "number" },
      genre: { type: "array" },
      amount: { type: "number" },
      // theatreName: { type: "string" },
    },
    required: [
      "title",
      "description",
      "releaseDate",
      "genre",
      "duration",
      "amount",
      // "theatreName",
    ],

    //additionalProperties: true,
  };

  const validate = ajv.compile(schema);

  const valid = validate(req.body);

  if (!valid) {
    console.log(validate.errors);
    res.status(400).json({ err: validate.errors });
  }
  //to validate schema using ajv , send data in raw json

  const {
    title,
    description,
    releaseDate,
    genre,
    duration,
    amount,
    // theatreName,
  } = req.body;

  const newMovie = await Movies.create({
    title,
    description,
    releaseDate,
    genre,
    duration,
    amount,
    // theatreName,
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
      // theatreName,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
  //res.status(200).json(newMovie);
});

// findOne by  title , use projection and populate
const populateMovies = async (req, res) => {
  //const { title } = req.params.title;
  const movie = await Movies.findOne(
    { title: req.body.title },
    { _id: 0, description: 0, genre: 0 }
  ).populate("theatreName");
  console.log("populated data");

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).json({ message: "Could not load" });
  }
};

//aggregate pagination
const aggregatePagination = asyncHandler(async (req, res) => {
  try {
    let page = parseInt(req.query.p) - 1 || 0;
    let limit = parseInt(req.query.limit) || 4;
    let sort = req.query.sort || "releaseDate";

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const movie = await Movies.find()
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Movies.countDocuments();

    const response = {
      total,
      page: page + 1,
      limit,
      movie,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not load" });
  }
});

const getOneMovie = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const movie = await Movies.findOne({ title });
  res.status(200).json(movie);
});

const getMovies = asyncHandler(async (req, res) => {
  //pagination
  const page = req.query.p || 1;
  const perPage = 5;
  const movies = await Movies.find()
    .skip((page - 1) * perPage)
    .limit(perPage);
  res.status(200).json(movies);
});

//find using projection and populate
const getMoviesByProjection = asyncHandler(async (req, res) => {
  const movies = await Movies.findById(req.params.id, {
    title: 1,
    // _id: 0,
    theatreName: 1,
  }).populate("theatreName");
  res.status(200).json(movies);
});

const addMultiple = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    releaseDate,
    duration,
    genre,
    amount,
    theatreName,
  } = req.body;

  const newMovies = await Movies.insertMany({
    title,
    description,
    releaseDate,
    duration,
    genre,
    amount,
    theatreName,
  });

  if (newMovies) {
    res.status(201).json({
      message: "Multiple movies added successfully",

      title,
      description,
      releaseDate,
      duration,
      genre,
      amount,
      theatreName,
    });
  } else {
    res.status(400).json({ message: "Something went wrong!" });
  }
});

const updateMovies = asyncHandler(async (req, res) => {
  const movies = await Movies.findById(req.params.id);

  if (!movies) {
    res.status(400);

    throw new Error("Movie not found. Please check the given Movie ID ");
  }

  const updatedMovie = await Movies.findByIdAndUpdate(
    req.params.id,
    req.body
    // {new: true}
  );

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
  populateMovies,
  getMoviesByProjection,
  aggregatePagination,
  addMultiple,
};
