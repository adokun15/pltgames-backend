/*
The purpose of this project;
  
Personal
 - to learn and understand typescript;
 - see how database works under load;
 
Community 
 - To build a fun app for gamers;
 - To allow gamer earn from their skills;

 */
/*
import express from "express";
const app = express();
const port = "3030";

//Usees Routes 
app.route("/user", );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
*/

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UserRouter from "./users/users.route";
import matchRouter from "./matches/matches.route";
import participantRouter from "./participants/participants.route";
import AuthRouter from "./auth/auth.route";
import tournamentRouter from "./tournaments/tournaments.route";
import {
  errorLoggingMiddleWare,
  errorResponseHandler,
  RouteNotFoundHandler,
} from "./utils/middleware/error";
//import { errorHandler, methodNotAllowedHandler, notFoundHandler } from './middleware/errorhandler.middleware';

const app = express();
const PORT = 3000;

dotenv.config({ path: ".env.local" });

app.use(cookieParser());
app.use(cors());
app.use(express.json());

//Auth
app.use("/v1/oauth", AuthRouter);

//User
app.use("/v1/user", UserRouter);

//Tournament
app.use("/v1/tournaments", tournamentRouter);

//Matches
app.use("/v1/matches", matchRouter);

//participants
app.use("/v1/participants", participantRouter);

//Bot Control
//app.use('/discord_bot');

app.get("/", (req, res) => {
  res.send("Welcome to Pltgames API!");
});

// 404 handler
app.use(RouteNotFoundHandler);
//app.use(methodNotAllowedHandler(['GET', 'POST', 'PUT', 'DELETE']));

// Global error handler - must be last middleware
app.use(errorResponseHandler);

//Log SomeEles
app.use(errorLoggingMiddleWare);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
