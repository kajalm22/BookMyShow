const asyncHandler = require("express-async-handler");
const Theatre = require("../model/theatreModel");

const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
const ajvErrors = require("ajv-errors");
const express = require("express");
ajvErrors(ajv);

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

    throw new Error("Something went wrong while adding theatre details");
  }

  const schema = {
    type: "object",
    properties: {
      theatreName: { type: "string" },
      address: { type: "string" },
    },
    required: ["theatreName "],
    additionalProperties: true,
  };

  const validate = ajv.compile(schema);

  const valid = validate(schema);

  if (!valid) console.log("schema validated");
  res.status(validate.errors);
  console.log(validate.errors);
});
//AJV
// const validate = ajv.compile({
//   type: "object",
//   required: ["theatreName"],
//   additionalProperties: false,
//   properties: {
//     type: { type: "string" },
//     theatreName: {
//       type: "string",
//       errorMessage: "CUSTOM ERROR: theatre name must be a string",
//     },
//     theatreName: { type: "string" },

//     errorMessage: {
//       type: "CUSTOM ERROR: not a string",
//       required: "CUSTOM ERROR: missing required property theatre name",
//       additionalProperties: "CUSTOM ERROR: cannot have other properties",
//     },
//   },
// });

// validate("theatreName");
// validate.errors;

// required: ["theatreName", "address"],
// additionalProperties: false,

// const valid = ajv.validate(schema);
// if (!valid) console.log(ajv.errors);

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
