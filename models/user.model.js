const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: "first name is required"
  },
  lastName: {
    type: String,
    required: "last name is required"
  },
  userName: {
    type: String,
    unique: "username should be unique"
  },
  email: {
    type: String,
    unique: "email should be unique"
  },
  password: {
    type: String,
    required: "password is required"
  },
  bio: {
    type: String,
    required: "bio is required",
  }
})

const User = model("User", UserSchema);

module.exports = { User };