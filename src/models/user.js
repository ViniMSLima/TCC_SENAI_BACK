const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  birthdate: {
    type: String,
    required: true,
    minlength: 2,
  },
  adm: {
    type: Boolean,
    required: true,
    minlength: 2,
  },
  sex: {
    type: String,
    required: true,
    minlength: 2,
  },
  BoschID: {
    type: String,
    required: true,
    minlength: 2,
  },
  password: {
    type: String,
    required: true,
    minlength: 12
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
  },
  cep: {
    type: String,
    required: true,
    minlength: 2,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  removedAt: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);
exports.User = User;
exports.UserSchema = UserSchema;