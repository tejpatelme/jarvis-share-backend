const { Post } = require("../models/post.model");


module.exports.getUsersPosts = async (req, res) => {
  const { userId } = req;

  const usersPosts = await Post.find({ userId }).populate("userId","firstName lastName username").lean();

  res.status(200).json({ success: true, usersPosts });
}


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

  await newPost.populate("userId","firstName lastName username").execPopulate();

  res.status(201).json({ success: true, newPost });
}
