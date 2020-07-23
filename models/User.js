const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  handle: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {type:String,default:null},
  resetPasswordExpires: {type:Date,default:null}
});
module.exports = User = mongoose.model("users", UserSchema);