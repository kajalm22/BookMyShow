const mongoose = require("mongoose");

const theatreSchema = mongoose.Schema({
  theatreName: {
    type: String,
    required: [true, "Please mention a theatre near you"],
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Theatre", theatreSchema);