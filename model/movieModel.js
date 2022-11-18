const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    theatreName: {
      type: String,
<<<<<<< HEAD
      // required: true,
=======
      //required: true,
>>>>>>> 319fa951c99459da5153e2b1aa886b2c9c92ac85
      theatre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theatre" }],
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
      type: [Array("action", "drama", "thriller", "horror", "suspense")],
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { strict: false },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movies", movieSchema);
