const mongoose = require("mongoose");

const paymentSchema = mongoose.model(
  {
    Customers: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customers",
    },
    Booking: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
    },

    paymentType: {
      type: String,
      required: true,
      enum: ["CREDITCARD", "DEBITCARD", "NET-BANKING"],
    },

    amount: {
      type: Number,
      required: [
        true,
        "Please pay the amount to complete the booking process.",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["PAID", "UNPAID"],
    },
    total:{
      type: Number,
      required: true
    },

    transactionID: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
