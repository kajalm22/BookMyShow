const mongoose = require("mongoose");
const { schema } = require("./theatreModel");

const movieSchema =  new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId, //custom ID by user
    theatre_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
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

    genre: {
      // type: [Array("action", "drama", "thriller", "horror", "suspense")],
      type: [String]
    },
    amount: {
      type: Number,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);
// schema.index({title: 'text'}) //creating an index on title field for text search

module.exports = mongoose.model("Movies", movieSchema);
