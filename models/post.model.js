const { Schema, model } = require("mongoose");

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
  postedOn: {
    type: String,
  },
  likes: {
    count: Number,
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
  }
})

const Post = model("Post", PostSchema);

module.exports = { Post };