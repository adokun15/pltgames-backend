//Routers for users;
import { Router } from 'express';
import { GetSingleUserInfoController, GetUserController } from './users.controller.js';
import { AuthorizationClientRequest } from '@/utils/middleware/auth.js';

const UserRouter = Router();

//With Session Token FROM CHALLONGE API
UserRouter.route('/')
.get(AuthorizationClientRequest, GetUserController)

//Public: Rate limit
UserRouter.route('/:username')
.get(GetSingleUserInfoController)


export default UserRouter; 