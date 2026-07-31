//Routers for users;
import { Router } from 'express';
import { AuthCodeController } from './auth.controller';

const AuthRouter = Router();

//With Auth Token FROM CHALLONGE API
AuthRouter.route('/challonge/:code').post(AuthCodeController)

//Discord api;
//AuthRouter.route('/discord/:code')
export default AuthRouter;