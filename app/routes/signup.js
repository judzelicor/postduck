import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import HomeFeed from "../models/HomeFeedModel.js"


let router;
let systemMessages;

router = express.Router();

router.get("/signup", (request, response, next) => {
    if (response.status(200)) {
        const greetings = "Welcome to Quacker!"
        response.render("signup", {
            greetings: greetings, 
            pageTitle: "Register for Postduck | What's quacking? ", 
            stylesheets: ["index", "register"], 
            formValues: null, 
            systemMessages: systemMessages,
        })
    }
});

router.post("/signup", async (request, response, next) => {
    console.log(request.body)
    let userHomeFeed;
    let { firstName, lastName, username, email, password } = request.body;
    console.log(request.body)
    if (firstName && lastName && username && email && password) {
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (!user) {
            password = await bcrypt.hash(password, 12);

            User.create({
                firstName,
                lastName,
                email,
                username,
                password
            })
            .then(user => {
                request.session.user = user;
                console.log("user session", request.session.user)
                console.log("user", user)
                let owner;

                owner = user;
                userHomeFeed = new HomeFeed({ owner }).save()
            })
            .then(_ => {
                response.json({ success: true, redirect: "/" })
            })
            .catch(error => {
                console.log(error)
                if (error.errors.username.kind === "minlength") {
                    response.json({ success: false, message: "Username is too short." })
                }

                else if (error.errors.username.kind === "maxlength") {
                    response.json({ success: false, message: "Username is too long." })
                }
            })

        }

        else {
            // When there is a user found in the database with at least one matching sign up credential
            if (username === user.username) {
                // signupErrorMessage = "There is an existing user with this username."
                response.status(200).json({ success: false, message: "Username is already in use."})
            }

            else if (email === user.email) {
                response.status(200).json({ success: false, message: "Email is already in use."})
            }

            else if (username === user.username && email === user.email) {
                response.status(200).json({ success: false, message: "Username and email are already in use."})
            }

        }

    }

});

export default router;