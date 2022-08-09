import express from "express";
import {
    homepage,
    login,
    signup,
    logout,
    userProfile
} from "./routes/index.js";
import path from 'path';
import { fileURLToPath } from 'url';
import database from "./mongodb/database.js";
import session from "express-session";
import posts from "./api/posts.js";
import user from "./api/user.js";
import SocketServer from "./websockets/socketServer.js"



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

let app;
let port;
app = express();
port = 8080;

// Setup body parser
app.use(express.json())

// Setup sessions
app.use(session({
    secret: "18bjToYmZ492",
    resave: true,
    saveUninitialized: false
}));

// Serve static files from the public folder
app.use(express.static(__dirname + '/public'))

// Setup ejs as the templating engine
app.set("view engine", "ejs");
app.set("views", "views")

// Setup routes.
app.use(homepage);
app.use(signup);
app.use(login)
app.use(logout)
app.use(posts)
app.use(user)
app.use(userProfile)

// Display confirmation on the terminal that the app is listening for requests.
const server = app.listen(port, () => {
    console.log(`Server is listening on port: ${ port }`)
})

const socketServer = new SocketServer(server);

socketServer.connect();