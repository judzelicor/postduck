import express from "express";
import Post from "../models/PostModel.js";
import User from "../models/User.js"
import HomeFeed from "../models/HomeFeedModel.js";

let router;
let post;

router = express.Router();

router.get("/api/post/quack", async (request, response) => {
  let posts = await Post.find({}).sort({"createdAt": 1});
  posts = await Promise.all(posts.map(async (post) => {
    post = await User.populate(post, { path: "postedBy" })

    return post
  }))

  response.json({ posts: posts })
})

router.post("/api/create/post", async (request, response) => {
  let user;
  let userHomeFeed;
  let postContent;
  let post;
  let postIsPinned;
  let primaryUserFollowers;
  let follower;
  let userHomeFeedOwnerId;

  user = request.session.user;
  postContent = request.body.postContent;
  postIsPinned = request.body?.pinned ? true : false;

  userHomeFeedOwnerId = user._id;

  if (user && postContent) {
    post = await new Post({
      content: postContent,
      postedBy: user,
      pinned: false,
    }).save();

    if (post) {
      // Update the home feed of the user in session
      userHomeFeed = await HomeFeed.findOneAndUpdate({ owner: userHomeFeedOwnerId}, { "$push": { homeFeed: post } });

      // Update the newPost field for every follower of the user
      user = await User.findById(userHomeFeedOwnerId);

      primaryUserFollowers = user.followers;

      for (let follower in primaryUserFollowers) {
        const followerHomeFeed = await HomeFeed.findOneAndUpdate({ owner: primaryUserFollowers[follower]}, { "$push": { homeFeed: post } });
      }

      response.json({ data: await post.populate("postedBy") })

    }
  }

})

export default router;