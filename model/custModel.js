const mongoose = require("mongoose");

const custSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email ID is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please give a password."],
    },
    contact: {
      type: Number,
      required: [true, "Please mention your phone number"],
    },
    age: {
      type: Number,
      required: [true, "Please mention your age."],
    },
    gender: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customers", custSchema);
