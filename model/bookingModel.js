const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    Customers: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customers",
    },
    Movies: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movies",
    },
    Payments: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Payment"
    },
  

    seats: {
      type: String,
      required: [true, "Please mention number of seats"],
      enum: ["UNAVAILABLE", "AVAILABLE"],
      default: "AVAILABLE"
    },
    status: {
      type: String,
      required: true,
      enum: ["paid", "unpaid"],
      // default: "unpaid"
    },
    bookingID: {
      type: Number,
      // required: true,
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

module.exports = mongoose.model("Booking", bookingSchema)
