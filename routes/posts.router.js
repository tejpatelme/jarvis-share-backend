require("express-async-errors");
const { Router } = require("express");
const { verifyToken } = require("../middlewares");
const { createNewPost, getUsersPosts, getSinglePostById, updateLikes, getAllPosts, updatePostComments, deletePostById, deleteComment } = require("../controllers/posts.controller");

const router = Router();

router.route("/").get(verifyToken, getAllPosts);
router.route("/:postId")
  .get(verifyToken, getSinglePostById)
  .delete(verifyToken, deletePostById);

router.route("/likes/:postId").post(verifyToken, updateLikes);
router.route("/comment/:postId").post(verifyToken, updatePostComments);
router.route("/comment/:postId/delete").post(verifyToken, deleteComment);
router.route("/newpost").post(verifyToken, createNewPost);

module.exports = router;