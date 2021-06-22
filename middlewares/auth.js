const jwt = require("jsonwebtoken");
const validator = require("validator");
const { User } = require("../models/user.model");

const checkIfUsernameExists = async (req, res, next) => {
  const { username } = req.body;

  const usernameExists = await User.findOne({ username: username.toLowerCase() });

  if (usernameExists) {
    return res.status(409).json({
      success: false,
      errorMessage:
        "Username is already taken. Please select a different username",
    })
  }

  next();
}

const checkIfUserExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    return res.status(409).json({
      success: false,
      errorMessage:
        "A user with the specified email already exists. Please login instead",
    });
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  const isEmail = validator.isEmail(email);

  if (!isEmail) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Email is invalid" });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  const isStrongPassword = validator.isStrongPassword(password, { minSymbols: 0, minUppercase: 0, minNumbers: 0 });

  if (!isStrongPassword) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Password is not strong enough" });
  }

  next();
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  req.userId = decodedToken.userId;

  next();
};

module.exports = { validateEmail, validatePassword, verifyToken, checkIfUserExists, checkIfUsernameExists };