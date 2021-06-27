require("express-async-errors");
const { Router } = require("express");
const { verifyToken } = require("../middlewares");
const { createNewPost, getUsersPosts, getSinglePostById, updateLikes, getAllPosts } = require("../controllers/posts.controller");

const router = Router();

router.route("/").get(verifyToken, getAllPosts);

router.route("/:postId").get(verifyToken, getSinglePostById);

router.route("/likes/:postId").post(verifyToken, updateLikes);

router.route("/newpost").post(verifyToken, createNewPost);

module.exports = router;