const { Post } = require("../models/post.model");

module.exports.createNewPost = async (req, res) => {
  const { userId } = req;
  const { content } = req.body;

  const newPost = await Post.create({
    userId,
    content,
    likes: {
      count: 0,
      likedBy: []
    },
    postedOn: new Date().toISOString(),
  });

  res.status(201).json({success: true, newPost});
}