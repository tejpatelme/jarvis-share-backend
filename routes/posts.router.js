require("express-async-errors");
const { Router } = require("express");
const { verifyToken } = require("../middlewares");
const { createNewPost, getUsersPosts } = require("../controllers/posts.controller");

const router = Router();

router.route("/").get(verifyToken, getUsersPosts);

router.route("/newpost").post(verifyToken, createNewPost);

module.exports = router;