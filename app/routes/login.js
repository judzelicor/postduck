import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

let router;

router = express.Router();

router.get("/login", (request, response) => {
    const user = request.session.user;
    if (user) {
        response.redirect("/home")
    } else {
        response.render("login", {
            pageTitle: "Log in to Quacker | What's quacking?",
            stylesheets: ["index", "login"]
        })
    }
});

router.post("/login", async (request, response) => {
    const { username, email, password } = request.body;

    if (email || username && password) {
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        })
        .catch(error => {
            console.log(error, "login")
        })

        if (user) {
            const passwordIsAMatch = await bcrypt.compare(password, user.password);

            if (passwordIsAMatch) {
                request.session.user = user;
    
                response.json({ success: true, redirect: "/home" });
            }

            else {
                response.json({ success: false, message: "Password is not correct." });
            }
        } else {
            response.json({ success: false, message: "There is no user with this email or username." })
        }
        
    } else {
        console.log("No user...")
    }
})

export default router;