//Routers for users;
import { Router } from 'express';
import { AuthCodeController, RefreshAccessTokenController } from './auth.controller';

const router = Router();

//With Auth Token FROM CHALLONGE API
router.route('/oauth/code').post(AuthCodeController)

//Refresh token
router.route('/oauth/refresh_token').post(RefreshAccessTokenController)

export default router;