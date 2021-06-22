const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


module.exports.signUpUser = async (req, res) => {
  const { firstName, lastName, email, username } = req.body;
  let { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    joinedOn: new Date().toISOString()
  })

  res.status(201).json({ success: true, newUser });
}