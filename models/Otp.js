const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const OtpSchema = new Schema({
  otp: {
    type: String,
    required: true
  }
  ,
  otpExpires: {type:Date,default:null}
  ,
  maxTry:{type:Number,default:3}
});
module.exports = Otp = mongoose.model("otps", OtpSchema);