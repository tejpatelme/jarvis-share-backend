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

exports.logInUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();

  if (user) {
    const passwordValid = await bcrypt.compare(password, user.password);

    if (passwordValid) {
      const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });

      user.__v = undefined;
      user.password  = undefined;

      return res.status(200).json({ success: true, token, user });
    }
  }

  return res
    .status(401)
    .json({ success: false, errorMessage: "email or password is incorrect" });
};