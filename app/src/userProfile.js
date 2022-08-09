import $ from "jquery";
import axios from "axios";

let button;
let userID;
let profilePageUserFollowers;
let profilePageUserFollowing;

$(() => {
  $("#followUserButton").on("click", (event) => {
    button = event.target;

    userID = button.dataset.userId

    profilePageUserFollowers = $("#profilePageUserFollowersMagnitude__LvALIMY");
    profilePageUserFollowing = $("#profilePageUserFollowingMagnitude__LvALIMY");

    axios({
      method: "PUT",
      url: `/api/user/${ userID }/follow`,
    }).then(({ data }) => {

      $("#profilePageUserFollowersMagnitude__LvALIMY").text(data.querriedUser.followers.length)
      console.log(data.transaction)
      if (data.transaction == "unfollowed") {
        $("#followUserButton").removeClass("bg-red-500 border")
        $("#followUserButton").text("Follow")
        $("#followUserButton").attr("data-action", "follow")
      } else {
        console.log("Followed")
        $("#followUserButton").text("Unfollow")
        $("#followUserButton").addClass("bg-red-500 border")
        $("#followUserButton").attr("data-action", "unfollow")
      }
    })

  })

})