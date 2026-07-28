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

import express from 'express';
import cors from 'cors';
import UserRouter from './users/users.route';
import matchRouter from './matches/matches.route';
import participantRouter from './participants/participants.route';
import AuthRouter from './auth/auth.route';
//import { errorHandler, methodNotAllowedHandler, notFoundHandler } from './middleware/errorhandler.middleware';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//Auth
app.use("/oauth", AuthRouter);

//User
app.use("/users", UserRouter);

//Tournament
app.use("/tournaments", UserRouter);

//Matches
app.use('/matches', matchRouter)

//participants
app.use('/participants', participantRouter);

//Bot Control
//app.use('/discord_bot');


app.get('/', (req, res) => {
  res.send('Welcome to Pltgames API!');
});
// 404 handler
//app.use(notFoundHandler);
//app.use(methodNotAllowedHandler(['GET', 'POST', 'PUT', 'DELETE']));

// Global error handler - must be last middleware
//app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});