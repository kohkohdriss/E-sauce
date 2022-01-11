const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  //sécurité : unique càd on peut pas se réinscrir avec la même adresse email.
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
});
//plugin (uniqueValidator) pour sécurité: empêcher de se réinscrir avec la même adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
