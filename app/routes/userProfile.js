import express from "express";
import User from "../models/User.js";

let router;

router = express.Router();

router.get("/user/:username", async (request, response) => {
  let pageData;
  const visitedUserUsername = request.params.username;

  pageData = await getProfilePageHydration(visitedUserUsername, request.session.user);

  if (pageData) {
    response.render("userProfile", {
      stylesheets: ["index", "home"],
      pageTitle: pageData.pageTite,
      userLoggedIn: pageData.userLoggedIn,
      userVisited: pageData.userVisited,
    })
  }
})

async function getProfilePageHydration(username, userLoggedIn) {
  let userVisited;

  userVisited = await User.findOne({ username: username });


  if (userVisited) {

    const fullName = `${userVisited.firstName} ${userVisited.lastName}`

    return {
      pageTite: fullName,
      userLoggedIn: userLoggedIn,
      userVisited: userVisited,
    }

  }

}

export default router;