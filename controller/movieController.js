const asyncHandler = require("express-async-handler");
const Movies = require("../model/movieModel");
const Ajv = require("ajv");
const { query, response, json } = require("express");
const { db } = require("../model/theatreModel");
const ajv = new Ajv();
// const util = require("util")
const axios = require("axios")
const fetch = require("node-fetch");
const { CURSOR_FLAGS } = require("mongodb");

// const {  stringify} = require("flatted");

const addMovie = asyncHandler(async (req, res) => {
  //AJV 
  const schema = {
    type: "object",
    properties: {
      theatre_id: {type: "string"},
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
    console.log(newMovie)
    res.status(201).json( newMovie ,{
      message: "Movie has been added successfully"
    });
  } else {
    res.status(400).json("Something went wrong.");
  }
});


//save movies
const saveMovies = asyncHandler ( async ( req , res) => {
 
    const movies = new Movies({
      theatre_id:req.body.theatre_id,
      title: req.body.title,
      description: req.body.description,
      releaseDate:req.body.releaseDate,
      genre:req.body.genre,
      duration:req.body.duration,
      amount:req.body.amount
    })

    movies.save()
    res.status(200).json("Added")
    
})   
  

//find all matching keywords in title
const findWithKeyword = asyncHandler ( async ( req , res) => {
  let data = await Movies.find( 
    {
      "$or": [
        {title :{$regex:req.params.key , $options:"i"} }
      ]
    } 
  )
  //console.log(req.params.key)
    res.status(200).json(data)
})



// findOne by  title , use projection and populate
const populateMovies = async (req, res) => {
  try {
    const movie = await Movies.findOne({title: "sacrednow2"},{genre:0}).populate('theatre_id') ;
    
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

    const total = await Movies.countDocuments(); //gives total no of docs in collection

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

//search by keyword for movie title with aggregate pagination
const paginationMovies= async (req, res) => {
  const title = req.query.title;
  const page = req.query.page ;
  let limit = parseInt (req.query.limit) || 5;
  let skip = ((page - 1) * limit) || 0
  
  try {
      const result = await Movies.aggregate([
        
          { $match: {title: {$regex: title , $options: 'i'}}},
             { $sort: { releaseDate: 1 } 
        },

          { $facet: {
          "stage1" : [{ $count: "count"}],
          "stage2" : [ { "$skip": skip}, {"$limit": limit} ]
        
        }},
        {$unwind: "$stage1"},
        {$project:{
          countOfSearchedMovies: "$stage1.count",
          movies: "$stage2"
       }}
      ])

      // const total = await Movies.countDocuments({})
      // console.log(result)
      res.status(200).json(
        { Result: { pageNumber: page, limit: limit , searchedMovie: result 
       }})
  } catch (err) {
      res.status(500).json(err)
  }
}


// To get one movie by title
const getOneMovie = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const movie = await Movies.findOne({ title });
  res.status(200).json(movie);
});


//get all movies by pagination
const getMovies = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 5;
  const movies = await Movies.find()
    .skip((page - 1) * perPage)
    .limit(perPage)
  res.status(200).json(movies);
});


//find using projection 
const getMoviesByProjection = asyncHandler(async (req, res) => {
  const movies = await Movies.findById(req.params.id, {
    title: 1,
    theatreName: 1,
  })
  res.status(200).json(movies);
});



//find by aggregate projection
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
    console.log(newMovies)
    res.status(201).json({
      message: "Multiple movies added successfully"});
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

//get data using axios
const getByAxios = async (req , res) => {
    try{
  const { data}  = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=63bdb51dde03c0c24aff2141d65d6fe5`

)
res.send(data) 
  }catch(err){
console.log(err)
  }
}
  // console.log(data)


//get data using fetch
// const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': '7a32908fa0msh680b63b488f9d26p1da606jsn8c3fb3f95650'
//     }
//   }
// const url = 'https://world.openfoodfacts.org/api/v0/product/737628064502.json';

const getByFetch = async (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7a32908fa0msh680b63b488f9d26p1da606jsn8c3fb3f95650'
    }
  }
  const url = 'https://world.openfoodfacts.org/api/v0/product/737628064502.json';
    try {
        const data = await fetch(url,options)
        .then((res)=> 
        res.json())
        res.status(200).json(data)
    }

    catch (err) {
        res.status(500).json(err)
    }
}

//fetch data using pagination from a movies api
const getPaginatedData = async (req, res) => {
  const page = req.query.page
  const limit = req.query.limit
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7a32908fa0msh680b63b488f9d26p1da606jsn8c3fb3f95650'
    }
  }
  const url = `https://techcrunch.com/wp-json/wp/v2/posts?page=${page}&per_page=${limit}`;
    try {
        const data = await fetch(url,options)
        .then((res)=> 
        res.json())
        res.status(200).json(data)
    }

    catch (err) {
        res.status(500).json(err)
    }
}



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
  paginationMovies,
  projectMovies,
  saveMovies,
  getByAxios,
  getByFetch,
  getPaginatedData
  
};
