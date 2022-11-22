const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
// theatre_id:{
//    type:Number,
//   required:true,
  
// },
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
