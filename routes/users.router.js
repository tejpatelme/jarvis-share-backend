require("express-async-errors");
const { Router } = require("express");
const { checkIfUsernameExists, checkIfUserExists, validateEmail, validatePassword, verifyToken } = require("../middlewares");
const { signUpUser, logInUser, getAllUsers, updateFollowingAndFollowersCount, getUserById } = require("../controllers/users.controller");

const router = Router();

router.route("/").get(getAllUsers);

router.route("/singleuser").get(verifyToken, getUserById)

router.route("/follow").post(verifyToken, updateFollowingAndFollowersCount)

router.route("/signup").post(checkIfUsernameExists, checkIfUserExists, validateEmail, validatePassword, signUpUser);

router.route("/login").post(logInUser);

module.exports = router;