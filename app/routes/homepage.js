import express from "express";
import { verifyExistingUser } from "../middlewares/index.js";

let router;

router = express.Router();

router.get("/", (request, response, next) => {
    const user = request.session.user;

    if (user) {
        response.redirect("/home")
    } else {
        const greetings = "Welcome to Quacker!"
        response.render("landing", { pageTitle: "Postduck", stylesheets: ["index"] })
    }
});

router.get("/home", (request, response, next) => {
    const user = request.session.user;


    if (user) {
        let fullName = (user.firstName + " " + user.lastName).slice(0, 20);
        if (fullName.length > 18) {
            fullName = fullName.slice(0, 16) + "..."
        }
        response.render("home", {
            user: user,
            fullName: fullName,
            pageTitle: "Home | Postduck",
            stylesheets: ["index", "home"]
        })
    } else {
        response.redirect("/")
    }
});

export default router;