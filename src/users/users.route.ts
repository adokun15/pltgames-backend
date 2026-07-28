//Routers for users;
import { Router } from 'express';
import { GetSingleUserInfoController, GetUserController } from './users.controller.js';

const router = Router();

//With Session Token FROM CHALLONGE API
router.route('/user')
.get(GetUserController)

//Public
router.route('/user/:username')
.get(GetSingleUserInfoController)




export default router;