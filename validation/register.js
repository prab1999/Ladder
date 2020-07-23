const axios = require('axios');
const Validator = require("validator");
const isEmpty = require("is-empty");


async function correctHandle(handle){
  axios.get("https://codeforces.com/api/user.info?handles="+handle).then(res=>{
  console.log(res.data["status"]==="OK");
    return res.data["status"]==="OK";
  }).catch(err=>{
    console.log(err);
    return false;
    
  })
  
}
module.exports = function validateRegisterInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
// handle checks
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "handle field is required";
  }
  else if (!correctHandle(data.handle)) {
    console.log("dfg");
    errors.handle = "Handle is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  console.log("Ddgd");
return {
  
    errors,
    isValid: isEmpty(errors)
  };
};