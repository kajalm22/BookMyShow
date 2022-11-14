const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  Theatre: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: "Theatre",
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  releaseDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  //genre: genreSchema,

  genre: ["action", "drama", "thriller", "horror", "suspense"],

  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Movies", movieSchema);
