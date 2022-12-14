const mongoose = require("mongoose");

const paymentSchema = new  mongoose.Schema(
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
      enum: ["CREDITCARD", "DEBITCARD", "NETBANKING"],
    },

    amount: {
      type: Number,
      required: [
        true,
        "Please pay the amount to complete the booking process.",
      ],
    },
    pay_status: {
      type: String,
      required: true,
      enum: ["paid", "unpaid"],
    },
    total:{
      type: Number,
      required: true
    },

  },
  {
    // timestamps: true,
  }
);


module.exports = mongoose.model("Payment", paymentSchema);
