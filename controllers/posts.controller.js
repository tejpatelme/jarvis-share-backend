const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "tejpatel",
  api_key: "624597974621587",
  api_secret: "Uq8-G2wn9QlaDDcDCSgs2rWRcmQ"
});

module.exports.getUsersPosts = async (req, res) => {
  const { userId } = req;

  const usersPosts = await Post.find({ userId }).populate("userId", "firstName lastName username").lean();

  res.status(200).json({ success: true, usersPosts });
}


module.exports.createNewPost = async (req, res) => {
  const { userId } = req;
  const { postContent } = req.body;
  let mediaFile = "";
  let media = {};

  if (req.files) {
    mediaFile = req.files.postMedia;
    const response = await cloudinary.uploader.upload(mediaFile.tempFilePath, { resource_type: "auto" });
    console.log(response);
    media.mediaURL = response.secure_url;
    media.mediaType = response.resource_type;
  }

  let newPost = await Post.create({
    userId,
    content: postContent,
    likes: {
      count: 0,
      likedBy: []
    },
    postedOn: new Date().toISOString(),
    comments: []
  });

  if (media) {
    newPost.media = media;
    await newPost.save();
  }

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

  const post = await Post.findById(postId);

  const match = post.likes.likedBy.findIndex((user) => String(user) === userId);

  if (match !== -1) {
    post.likes.likedBy.splice(match, 1);
    post.likes.count--;
  }
  else {
    if (String(post.userId) !== String(userId)) {
      console.log(post.userId, userId);
      let user = await User.findById(post.userId);
      user.notifications.push({
        from: userId,
        type: "like",
        createdAt: new Date().toISOString(),
        postId: post._id
      });
      await user.save();
    }
    post.likes.likedBy.push(userId);
    post.likes.count++;
  }

  let updatedPost = await post.save();
  await updatedPost.populate("userId", "firstName lastName username").execPopulate();

  res.status(200).json({ success: true, updatedPost });
}

module.exports.getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate("userId", "firstName lastName username").lean();

  res.status(200).json({ success: true, posts });
}

module.exports.updatePostComments = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
  const { content } = req.body;

  const post = await Post.findById(postId);

  if (String(post.userId) !== String(userId)) {
    let user = await User.findById(post.userId);
    user.notifications.push({
      from: userId,
      type: "comment",
      createdAt: new Date().toISOString(),
      postId: post._id
    });
    await user.save();
  }

  post.comments.push({
    userId,
    content,
    date: new Date().toISOString()
  })

  let updatedPost = await post.save();
  updatedPost = await updatedPost.populate("userId", "firstName lastName username").execPopulate();

  res.status(200).json({ success: true, updatedPost });
}

module.exports.deletePostById = async (req, res) => {
  const { postId } = req.params;

  const deletedPost = await Post.findByIdAndDelete(postId).select("_id").lean();

  res.status(200).json({ success: true, deletedPost });
}

module.exports.deleteComment = async (req, res) => {
  const { commentId } = req.body;
  const { postId } = req.params;

  let post = await Post.findById(postId);
  const commentIndex = post.comments.findIndex((comment) => String(comment._id) === commentId);

  post.comments.splice(commentIndex, 1);
  post = await post.save();
  post = await post.populate("userId", "firstName lastName username").execPopulate();

  res.status(200).json({success: true, post});
}