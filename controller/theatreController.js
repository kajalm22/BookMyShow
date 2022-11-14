const asyncHandler = require("express-async-handler");
const Theatre = require("../model/theatreModel");

const addTheatre = asyncHandler(async (req, res) => {
  const { theatreName, address } = req.body;

  const newTheatre = await Theatre.create({
    theatreName,
    address,
  });

  if (newTheatre) {
    res.status(201).json({
      message: "Theatre has been added successfully",
      theatreName,
      address,
    });
  } else {
    res.status(400);

    throw new Error("Something went wrong while addind theatre details");
  }
});

const getTheatre = asyncHandler(async (req, res) => {
  const getTheatres = await Theatre.find();
  res.status(200).json(getTheatres);
});

module.exports = { addTheatre, getTheatre };
