import $, { data, post } from "jquery";
import axios from "axios";
import { format, formatISO } from "date-fns";
import { io } from "socket.io-client";

const socketConnection = io.connect();
let newPostsDisplay;
socketConnection.emit("subscribe", userSessionOwner)
socketConnection.on("new post", () => {
	axios({
		method: "GET",
		url: "/api/user/newposts"
	}).then(({ data: { newPosts } }) => {
		const newPostsCount = newPosts.length;
		newPostsDisplay = newPosts
		const html = `
			<div class="updateHomeFeedIndicatorContainer__aed1SB">
				<p class="updateHomeFeedIndicatorContent__aed1SB">Reveal ${ newPostsCount } New ${ newPostsCount === 1 ? "Post" : "Posts"}</p>
			</div>
		`
		$("#updateHomeFeedIndicator__aed1SB").html(html)
	})
})

$("#updateHomeFeedIndicator__aed1SB").on("click", () => {
	$("#updateHomeFeedIndicator__aed1SB").html("")
	newPostsDisplay.slice(0).reverse().map(post => {
		const html = createPostElement(post);
		$("#posts__brXNqg").prepend(html)
	})

	axios({
		method: "POST",
		url :"/api/user/FlushNewPosts"
	})

})


let quackTextArea;
let broadcastQuackButton;
let quack;
let quackTextContent;
let textArea;
let postQuackButton;

textArea = $("#postTextArea")
postQuackButton = $("#broadcastQuackButton")

$(() => {
	collectUserHomeFeed();

	$(".qc0CtQK").on("click", () => {
		$(".a5f0R88").toggleClass("hidden")
		$(document.body).toggleClass("a5f0R88__open")
	})

	$(".contextMenuIsOpen__yXptsM").on("click", () => {
		$(".a5f0R88").toggleClass("hidden")
		$(document.body).toggleClass("a5f0R88__open")
	})

	$("#logoutButton").on("click", () => {
		window.location.href = "/logout"
	})

	textArea.on("keyup", (event) => {
		quackTextContent = $("#postTextArea").val().trim();
		console.log(quackTextContent)
		if (quackTextContent.length === 0) {
			postQuackButton.prop("disabled", true);
			return;
		}

		postQuackButton.prop("disabled", false);
		return;
	})

	postQuackButton.on("click", () => {
		let post;
		let postContent;
		console.log("clicked")
		postContent = $("#postTextArea").val().trim();
		
		post = {
			postContent: postContent
		};

		axios({
			method: "POST",
			url: "/api/create/post",
			data: post,
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(({ data: { data } }) => {

			const post = data
			const quack = data
			const newPostContent = data;

			socketConnection.emit("new post", userSessionOwner, newPostContent);

			const html = createPostElement(post)
			html.hide().addClass("animated newPost")
			$("#posts__brXNqg").prepend(html)

			html.show(500, () => {
				html.removeClass("animated")
			})

			setTimeout(() => {
				html.removeClass("newPost")
			}, 2000)

			textArea.val("");
			postQuackButton.prop("disabled", true)

		})
	})
	
})

socketConnection.on("update home feed", (postingUser) => {
	// if (user.following.includes(postingUser._id)) {
	// 	axios({
	// 		method: "GET",
	// 		url: "/api/user/homefeed"
	// 	}).then(response => {
	// 		console.log(response.data.posts)
	// 		const posts = response.data.posts;
	// 		console.log(user.homeFeed)
	// 		const newQuacksCount = posts.length - user.homeFeed.length;
	
	// 		$("#updateHomeFeedIndicator__aed1SB").prepend(`
	// 			<div class="container__aed1SB">
	// 				<p>Show ${ newQuacksCount } New Quack</p>
	// 			</div>
	// 		`)
	// 	})
	// }
})

function createPostElement(post) {
	const accountIsVerified = post.postedBy?.accountIsVerified || false;
	let timestamp = post.createdAt;
	timestamp = formatTimestamp(timestamp);
	return $(`
		<div class="post__Ad4h4u">
			<div class="postContainer__Ad4h4u">
				<div class="userProfilePictureContainer__Ad4h4u">
					<img class="userProfileImage__Ad4h4u" src="${ post.postedBy.profilePicture }" />
				</div>
				<div>
					<div class="postHeader__Ad4h4u">
						<div class="userFullName__Ad4h4u">
							<a class="userProfileLink__Ad4h4u" href="/user/${ post.postedBy.username }">
								<h3>${ post.postedBy.firstName } ${ post.postedBy.lastName }</h3>
							</a>
						</div>
						${ accountIsVerified ?  `
							<div class="verifiedAccount__Ad4h4u">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 491">
									<path fill="#FFC400" d="M476.594 195.248a86.513 86.513 0 0 1-17.64-15.732 80.809 80.809 0 0 1 5-24.542c5.51-18.656 12.372-41.874-.854-60.041-13.323-18.313-37.661-18.927-57.214-19.428a83.84 83.84 0 0 1-24.421-2.625 83.022 83.022 0 0 1-9.928-22.197c-6.524-18.58-14.652-41.706-36.417-48.779C314-4.96 295.046 8.081 278.334 19.55a79.58 79.58 0 0 1-22.329 12.553 79.449 79.449 0 0 1-22.338-12.553C216.954 8.072 197.995-4.929 176.88 1.904c-21.76 7.073-29.885 30.187-36.416 48.772a84.636 84.636 0 0 1-9.823 22.124 81.943 81.943 0 0 1-24.527 2.699c-19.552.5-43.89 1.115-57.213 19.426-13.226 18.178-6.364 41.396-.853 60.053a83.1 83.1 0 0 1 5.046 24.387 83.48 83.48 0 0 1-17.692 15.884C19.627 207.28 0 222.26 0 245.436c0 23.178 19.627 38.156 35.406 50.188a86.513 86.513 0 0 1 17.64 15.732 80.809 80.809 0 0 1-5 24.542c-5.51 18.656-12.372 41.875.854 60.042 13.323 18.312 37.661 18.926 57.214 19.427a83.84 83.84 0 0 1 24.421 2.625 83.022 83.022 0 0 1 9.928 22.197c6.531 18.584 14.656 41.707 36.421 48.782a38.357 38.357 0 0 0 11.947 1.906c16.38 0 31.339-10.281 44.84-19.552A79.562 79.562 0 0 1 256 458.77a79.467 79.467 0 0 1 22.34 12.553c16.712 11.478 35.665 24.468 56.785 17.646 21.76-7.073 29.885-30.187 36.416-48.771a84.636 84.636 0 0 1 9.823-22.125 81.943 81.943 0 0 1 24.527-2.699c19.552-.5 43.89-1.115 57.213-19.426 13.227-18.177 6.365-41.396.853-60.053a83.1 83.1 0 0 1-5.046-24.386 83.48 83.48 0 0 1 17.693-15.885c15.77-12.031 35.396-27.01 35.396-50.187 0-23.178-19.627-38.156-35.406-50.188Zm-125.51 11.938L244.417 313.853a21.328 21.328 0 0 1-30.167 0l-53.334-53.333a21.333 21.333 0 1 1 30.168-30.168l38.25 38.251 91.582-91.584a21.333 21.333 0 1 1 30.168 30.167Z"/>
								</svg>
							</div>
						` : ""}
						<div class="username__Ad4h4u">
							<h4>@${ post.postedBy.username }</h4>
						</div>
						<div class="postTimeStamp__Ad4h4u">
							<div class="postTimeStampIcon__Ad4h4u">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 0 512 512">
									<path d="m382.867 157.379 20.074-20.074c7.801-7.801 7.801-20.45 0-28.246-7.8-7.801-20.445-7.801-28.246 0l-20.074 20.074c-33.68-28.063-74.605-45.016-118.262-48.985V39.95h19.309c11.031 0 19.973-8.945 19.973-19.976S266.699 0 255.668 0h-78.566c-11.032 0-19.973 8.941-19.973 19.973s8.941 19.976 19.973 19.976h19.308v40.2C87.13 90.085 0 181.89 0 295.612 0 415.207 96.777 512 216.387 512c119.59 0 216.383-96.777 216.383-216.387 0-51.086-17.594-99.465-49.903-138.234zM216.383 472.05c-97.285 0-176.438-79.149-176.438-176.438 0-97.285 79.153-176.433 176.438-176.433 97.289 0 176.437 79.148 176.437 176.433 0 97.29-79.148 176.438-176.437 176.438zm92.566-269c7.801 7.8 7.801 20.449 0 28.246l-78.441 78.441c-7.801 7.801-20.45 7.801-28.246 0-7.801-7.8-7.801-20.449 0-28.246l78.437-78.441c7.801-7.801 20.45-7.801 28.25 0zm0 0"/>
								</svg>
							</div>
							<span> ${ timestamp } </span>
						</div>
					</div>
					<div class="postBody__Ad4h4u">
						<p class="postContent__Ad4h4u">
							${ post.content }
						</p>
					</div>
				</div>
			</div>
		</div>
	`)
}

async function populateHomeFeed() {
	const posts = await axios({
		method: "GET",
		url: "/api/post/quack",
	})
	.then(({ data }) => {
		return data.posts
	})

	posts.map(post => {

		const html = createPostElement(post)
		$("#posts__brXNqg").append(html)
	})
}

function formatTimestamp(timestamp) {

	const currentTime = new Date();
	const previousTime = new Date(timestamp);
	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerWeek = msPerDay * 7

	const elapsedTime = currentTime - previousTime;

	if ((elapsedTime / 1000) < 30) return "Just Now"

	else if (elapsedTime < msPerMinute) return Math.round((elapsedTime/1000)).toString() + "s"

	else if (elapsedTime < msPerHour) return Math.round((elapsedTime/msPerMinute)).toString() + "m"

	else if (elapsedTime < msPerDay) return Math.round((elapsedTime/msPerHour)).toString() + "h"

	else if (elaspedTime < msPerWeek) return Math.round((elapsedTime/msPerDay)).toString() + "w"
}

function collectUserHomeFeed() {
	axios({
		method: "GET",
		url: "/api/user/homefeed",
	})
	.then(({ data: { user, newPosts, homeFeed, userHomeFeed } }) => {
		console.log(userHomeFeed)
		homeFeed.map((post) => {
			const html = createPostElement(post)
			$("#posts__brXNqg").prepend(html)
			$(".loadingAnimation__brXNqg").remove()
		})
	})
}