require("express-async-errors");
const { Router } = require("express");
const { checkIfUsernameExists, checkIfUserExists, validateEmail, validatePassword } = require("../middlewares");
const { signUpUser } = require("../controllers/users.controller");

const router = Router();

router.route("/signup").post(checkIfUsernameExists, checkIfUserExists,validateEmail, validatePassword, signUpUser);

module.exports = router;