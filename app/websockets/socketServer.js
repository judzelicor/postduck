import { Server } from "socket.io";
import HomeFeed from "../models/HomeFeedModel.js";
import mongoose from "mongoose"
import User from "../models/User.js";

class SocketServer {
  constructor(server) {
    this.server = server;
  }

  connect() {
    const io = new Server({ pingTimeout: 60000 }).listen(this.server);

    io.on("connection", (socket) => {

      socket.on("subscribe", (userSessionOwner) => {

        const privateRoomId = userSessionOwner._id
        socket.join(privateRoomId)
        
      })
      
      socket.on("new post", async (userSessionOwner, newPostContent) => {

        let userSessionOwnerData = await User.findById(userSessionOwner._id)

        let userSessionOwnerFollowersId = userSessionOwnerData.followers;
        let newPosts;
        let privateRoomId;

        privateRoomId = userSessionOwner._id;
        
        const post = newPostContent._id
        
        for (let followerIdIndex in userSessionOwnerFollowersId) {

          let followerHomeFeed = await HomeFeed.findOneAndUpdate({ owner: userSessionOwnerFollowersId[followerIdIndex]}, { "$push": { newPosts: { $each: [post], $position: 0 } } })
          
          io.to(followerHomeFeed.owner.toString()).emit("new post")
        }
          
      })
    })
  }
}

export default SocketServer;