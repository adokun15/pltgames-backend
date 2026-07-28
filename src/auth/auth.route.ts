//Routers for users;
import { Router } from 'express';
import { AuthCodeController, RefreshAccessTokenController } from './auth.controller';

const AuthRouter = Router();

//With Auth Token FROM CHALLONGE API
AuthRouter.route('/code').post(AuthCodeController)

//Refresh token
AuthRouter.route('/refresh_token').post(RefreshAccessTokenController)

export default AuthRouter;