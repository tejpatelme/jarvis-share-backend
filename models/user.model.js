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
  username: {
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
  },
  joinedOn: {
    type: String
  },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const User = model("User", UserSchema);

module.exports = { User };