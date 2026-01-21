import { Router } from 'express';

import {
  loginController,
  renewTokenController
} from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/authentication';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.post('/renew', authenticate, renewTokenController);

export default authRouter;
