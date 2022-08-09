import express from "express";
import User from "../models/User.js";

let router;

router = express.Router();

router.get("/logout", (request, response) => {
    if (request.session) {
      request.session.destroy(() => {
        response.redirect("/")
      })
    }
})

export default router;