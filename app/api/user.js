import express from "express";
import Post from "../models/PostModel.js";
import User from "../models/User.js"
import HomeFeed from "../models/HomeFeedModel.js";
import mongoose from "mongoose";

let router;
let post;
let user;

router = express.Router();

router.put("/api/user/:userID/follow", async (request, response) => {
  const userIDToFollow = request.params.userID.trim();

  user = await User.findById(userIDToFollow);

  if (!user) return response.sendStatus(404)

  // Make sure followers field is present before checking if user is a follower;
  const userIsAFollower = user.followers && user.followers.includes(request.session.user._id);

  const option = userIsAFollower ? "$pull" : "$addToSet";
  const transaction = userIsAFollower ? "unfollowed" : "followed"
  
  request.session.user = await User.findByIdAndUpdate(request.session.user._id, { [option]: { following: userIDToFollow} }, { new: true })
    .catch(error => {
      console.log(error)
    })

  const followedUser = await User.findByIdAndUpdate(userIDToFollow, { [option]: { followers: request.session.user._id } }, { new: true })
  .catch(error => console.log(error))

  response.json({ userLoggedIn: request.session.user, querriedUser: followedUser, transaction: transaction })

})

router.get("/api/user/homefeed", async (request, response) => {

  let user;
  let userHomeFeed;
  let newPosts;
  let homeFeed;
    
  user = request.session.user._id;

  // userHomeFeed = await HomeFeed.findOne({ owner: request.session.user._id }).populate("owner").populate({
  //   path: "newPosts",
  //   populate: {
  //     path: "postedBy"
  //   }
  // }).populate({
  //   path: "homeFeed",
  //   populate: {
  //     path: "postedBy"
  //   }
  // })

  userHomeFeed = await HomeFeed.aggregate([
    { $match: { "owner": mongoose.Types.ObjectId(request.session.user._id) } },
    {$addFields: {
      homeFeed: 
      { $concatArrays: [ "$newPosts", "$homeFeed" ] },
      newPosts: []
    } }
  ])

  userHomeFeed = await HomeFeed.findOneAndUpdate({ "owner": request.session.user._id }, { newPosts: [], homeFeed: userHomeFeed.homeFeed }).populate("owner").populate({
    path: "homeFeed",
    populate: {
      path: "postedBy"
    }
  })
  console.log(userHomeFeed.newPosts)
  if (user && userHomeFeed) {
    newPosts = userHomeFeed.newPosts;
    homeFeed = userHomeFeed.homeFeed;
    user = userHomeFeed.owner;
    response.json({ user, newPosts, homeFeed, userHomeFeed})
  }
})

router.get("/api/user/newposts", async (request, response) => {
  const userSessionOwner = request.session.user;

  const userHomeFeed = await HomeFeed.findOne({ "owner": userSessionOwner._id }).populate({
    path: "newPosts",
    populate: {
      path: "postedBy"
    }
  })
  console.log(userHomeFeed)
  const newPosts = userHomeFeed.newPosts;

  response.json({ newPosts })

})

router.post("/api/user/FlushNewPosts", async (request, response) => {
  const userSessionOwner = request.session.user;
  await HomeFeed.findOneAndUpdate({ "owner": userSessionOwner._id }, { newPosts: [] })

  response.sendStatus(200)
})

export default router;