const asyncHandler = require("express-async-handler");
const Movies = require("../model/movieModel");
//  const Theatre = require("../model/theatreModel");
// const mongoose = require("mongoose");
const Ajv = require("ajv");
// const res = require("express/lib/response");
// const { json } = require("express/lib/response");
// const { ObjectID } = require("bson");
// const { populate } = require("../model/theatreModel");
const ajv = new Ajv();

const addMovie = asyncHandler(async (req, res) => {
  const schema = {
    type: "object",
    properties: {
      theatre_id: {type: "number"},
      title: { type: "string" },
      description: { type: "string" },
      releaseDate: { type: "string" },
      duration: { type: "number" },
      genre: { type: "array" },
      amount: { type: "number" },
      // theatreName: { type: "string" },
    },
    required: [
      "theatre_id",
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
    theatre_id,
    title,
    description,
    releaseDate,
    genre,
    duration,
    amount,
    // theatreName,
  } = req.body;

  const newMovie = await Movies.create({
    // _id:mongoose.Types.ObjectId(),
    theatre_id,
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
      theatre_id,
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


//find all matching keywords in title
const findWithKeyword = asyncHandler ( async ( req , res) => {
  let data = await Movies.find( 
    {
      "$or": [
        {title :{$regex:req.params.key} }
      ]
    } 
  )
  //console.log(req.params.key)
    res.status(200).json(data)
})



// findOne by  title , use projection and populate
const populateMovies = async (req, res) => {
  try {
    const movie = await Movies.findOne({title: "sacred"})
    // .select("theatre_id address")
    .populate('theatre_id');
    
  //console.log(movie);
  res.status(200).json(movie)   
  } catch (error) {
    res.status(500).json(error)
  }
};



//aggregate pagination , find using keywords 
const aggregatePagination = asyncHandler(async (req, res) => {
  try{
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

    const total = await Movies.countDocuments(); //gives total no of data in collection

    const response = {
      total,
      page: page + 1,
      limit,
      movie
      
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not load" });
  }
    
});

// const paginationMovies= async (req, res) => {
//   const page = req.query.page;
//   const limit = parseInt(req.query.limit);
//   console.log(page);
//   console.log(limit);

//   try {
//       const result = await Movies.aggregate([
//           { $skip: (page - 1) * limit },
//           { $limit: limit },
//           { $sort: { title: 1 } }
//       ])
//       console.log(result)
//       res.status(200).json(result)
//   } catch (err) {
//       res.status(500).json(err.message)
//   }
// }


// To get one movie by title
const getOneMovie = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const movie = await Movies.findOne({ title });
  res.status(200).json(movie);
});

//get all movies by pagination
const getMovies = asyncHandler(async (req, res) => {
  // let aggregate_options = []
  const page = req.query.p || 1;
  const perPage = 5;
  const movies = await Movies.find()
    .skip((page - 1) * perPage)
    .limit(perPage)

  //   let match = {}

  // if(req.query.q) 
  // match.title = {$regex : req.query.q , $options: "i"}
  // aggregate_options.push({$match: match})


  res.status(200).json(movies);
});

//find using projection and populate
const getMoviesByProjection = asyncHandler(async (req, res) => {
  const movies = await Movies.findById(req.params.id, {
    title: 1,
    // _id: 0,
    theatreName: 1,
  }).populate("theatre_id");
  res.status(200).json(movies);
});



//get by aggregate projection
const projectMovies = async (req, res) => {
  try {
      const result = await Movies.aggregate([
          { $project: { _id: 0, title: 1 } }
      ])
      // console.log(result)
      res.status(200).json(result)
  } catch (err) {
      res.status(500).json(err.message)
  }
}


// insert multiple data as objects in postman
const addMultiple = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    releaseDate,
    duration,
    genre,
    amount,
    
  } = req.body;
  // console.log(req.body)

  const newMovies = await Movies.insertMany(req.body)
  
  if (newMovies) {
    res.status(201).json({
      message: "Multiple movies added successfully",

      title,
      description,
      releaseDate,
      duration,
      genre,
      amount,
      
    });
  } else {
    res.status(400).json({ message: "Something went wrong!" });
  }
});


//update movie details
const updateMovies = asyncHandler(async (req, res) => {

  const updatedMovie = await Movies.findByIdAndUpdate( 
   req.params.id,
    req.body
  );
  if (updatedMovie) {
    res.status(200).json(updatedMovie);
  } else {
    res.status(400);

    throw new Error("Movie details could not be updated!");
  }
});


const deletedMovies = asyncHandler(async (req, res) => {
  const movies = await Movies.deleteOne({ _id: req.params.id} );

  if (!movies) {
    res.status(400);

    throw new Error("Movie not found. Please check the Movie Id given");
  }else{
    res.status(200).json(movies)
  }
});


module.exports = {
  addMovie,
  getMovies,
  updateMovies,
  deletedMovies,
  getOneMovie,
  populateMovies,
  getMoviesByProjection,
  aggregatePagination,
  addMultiple,
  findWithKeyword,
// paginationMovies,
  projectMovies
};
