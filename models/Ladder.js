const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const LadderSchema = new Schema({
  userId:{
    type:String,
    required:true
  },
  name: {
    type: String,
    required: false
  },
  tags: {
    type: String,
    required: false
  },
  rating: {
    type: [Number],
    default: [800,3000],
    required:true
  },
  problems:{
      type:Map,
      required:true,
      of:String
  }
});
module.exports = Ladder = mongoose.model("ladders", LadderSchema);