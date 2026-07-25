//Routers for users;
import { Router } from 'express';
import { GetUserController, LoginUserController } from './users.controller.js';

const router = Router();

//With Auth Token FROM CHALLONGE API
router.route('/users')
//Authorize
.get(GetUserController)
//Login
.post(LoginUserController)


export default router;