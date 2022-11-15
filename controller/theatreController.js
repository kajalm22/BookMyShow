const asyncHandler = require("express-async-handler");
const Theatre = require("../model/theatreModel");

const Ajv = require("ajv");
const ajv = new Ajv();
const express = require("express");

const addTheatre = asyncHandler(async (req, res) => {
  // AJV
  const schema = {
    type: "object",
    properties: {
      theatreName: {
        type: "string",
      },
      address: {
        type: "string",
      },
    },
    required: ["theatreName", "address"],
  };

  const validate = ajv.compile(schema);

  const valid = validate(req.body);

  if (!valid) {
    console.log(validate.errors);
    res.status(400).json({ err: validate.errors });
  }

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

    throw new Error("Something went wrong while adding theatre details");
  }
});

const getOneTheatre = asyncHandler(async (req, res) => {
  const { address } = req.body;

  const theatre = await Theatre.findOne({ address });
  res.status(200).json(theatre);
});

const getTheatre = asyncHandler(async (req, res) => {
  const getTheatres = await Theatre.find();
  res.status(200).json(getTheatres);
});

const updateTheatre = asyncHandler(async (req, res) => {
  const theatre = await Theatre.findById(req.params.id);

  if (!theatre) {
    res.status(400);

    throw new Error("Theatre not  found. please check the given theatre ID");
  }

  const updatedTheatre = await Theatre.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (updatedTheatre) {
    res.status(200).json(updatedTheatre);
  } else {
    res.status(400);

    throw new Error("Could not update theatre details");
  }
});

const deleteTheatre = asyncHandler(async (req, res) => {
  const theatre = await Theatre.findById(req.params.id);

  if (!theatre) {
    res.status(400);

    throw new Error("Theatre not found. Please check the theatre ID given");
  }

  const deletedTheatre = await Theatre.deleteOne();
  res.status(200).json(deletedTheatre);
});

module.exports = {
  addTheatre,
  getTheatre,
  updateTheatre,
  deleteTheatre,
  getOneTheatre,
};
