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
  

    seats: {
      type: String,
      required: [true, "Please mention number of seats"],
      enum: ["UNAVAILABLE", "AVAILABLE"],
      default: "AVAILABLE"
    },
    status: {
      type: String,
      required: true,
      enum: ["CONFIRMED", "CANCELED"],
    },
    bookingID: {
      type: Number,
      // required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid: {
      type:Number,
    },
    unpaid: {
      type: Number
    }

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema)
