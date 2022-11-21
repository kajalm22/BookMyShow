const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, //custom ID by user
    theatre_id:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    }],

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
      type: [Array("action", "drama", "thriller", "horror", "suspense")],
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

module.exports = mongoose.model("Movies", movieSchema);
