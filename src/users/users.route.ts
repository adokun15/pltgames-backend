//Routers for users;
import { Router } from 'express';
import { GetSingleUserInfoController, GetUserController } from './users.controller.js';

const UserRouter = Router();

//With Session Token FROM CHALLONGE API
UserRouter.route('/')
.get(GetUserController)

//Public
UserRouter.route('/:username')
.get(GetSingleUserInfoController)


export default UserRouter;