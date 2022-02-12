const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  date: String,
})

const MediaSchema = new Schema({
  mediaURL: {
    type: String,
  },
  mediaType: {
    type: String
  }
})

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  content: {
    type: String,
    required: "Content of the post cannot be empty"
  },
  media: MediaSchema,
  postedOn: {
    type: String,
  },
  likes: {
    count: Number,
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  comments: [CommentSchema]
})

const Post = model("Post", PostSchema);

module.exports = { Post };