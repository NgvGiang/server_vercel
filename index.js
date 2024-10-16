import express from "express";
config();
// Create the connection to database
export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});


//for Oauth2
import {OAuth2Client} from "google-auth-library";
import mysql from "mysql2";
import bodyParser from "body-parser";
import {createUser,googleAuth} from "./authController.js";
import cors from "cors";
import {config} from "dotenv";

const app = express();
const port = 3000
app.use(express.json());
app.use(bodyParser.json());
const client = new OAuth2Client('1086171737744-s8mkhndpskmklbn31liqnlqoqog6mnkq.apps.googleusercontent.com');
const routerAPI = express.Router();
app.use('/', routerAPI); // necessary
app.use(cors());
routerAPI.get("/", (req, res) => {
    res.send("Hello World");
});
routerAPI.post("/auth/sign_up",createUser)
routerAPI.post("/auth/google",googleAuth)



app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});
export default app;