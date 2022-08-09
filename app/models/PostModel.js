import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: {
    type: String,
  },

  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  pinned: {
    type: Boolean
  }
}, { timestamps: true })

const Post = mongoose.model("Post", PostSchema)

export default Post;