import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HomeFeedSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  newPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  homeFeed: [{ type: Schema.Types.ObjectId, ref: "Post" }]
})

const HomeFeed = mongoose.model("HomeFeed",HomeFeedSchema);

export default HomeFeed;