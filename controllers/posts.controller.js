const { Post } = require("../models/post.model");


module.exports.getUsersPosts = async (req, res) => {
  const { userId } = req;

  const usersPosts = await Post.find({ userId }).populate("userId", "firstName lastName username").lean();

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

  await newPost.populate("userId", "firstName lastName username").execPopulate();

  res.status(201).json({ success: true, newPost });
}

module.exports.getSinglePostById = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;

  const singlePost = await Post.findById(postId).populate("userId", "firstName lastName username").lean();

  res.status(200).json({ success: true, singlePost });
}

module.exports.updateLikes = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(postId);

  const match = post.likes.likedBy.findIndex((user) => user === userId);

  if (match !== -1) {
    post.likes.likedBy.splice(1, match);
    post.likes.count--;
  }
  else {
    post.likes.likedBy.push(userId);
    post.likes.count++;
  }

  const updatedPost = await post.save();

  res.status(200).json({ success: true, updatedPost });
}