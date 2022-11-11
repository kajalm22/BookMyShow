const asyncHandler = require("express-async-handler");
const Theatre = require("../model/theatreModel");

const newTheatre = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);

  //     throw new Error("Please add a text field");
  //   }

  const theatre = await Theatre.create({
    name: req.body.name,
    address: req.body.address,
  });

  res.status(200).json(theatre);
});

const getTheatre = asyncHandler(async (req, res) => {
  const getTheatres = await Theatre.find();
  res.json(200).json(getTheatres);
});

module.exports = { newTheatre, getTheatre };
