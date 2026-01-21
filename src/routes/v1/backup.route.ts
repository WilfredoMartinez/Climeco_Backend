import { Router } from 'express';

import { backupHandler } from '@/controllers/backup.controller';
import { authenticate } from '@/middlewares/authentication';

const backupRouter = Router();

backupRouter.get('/', authenticate, backupHandler);

export default backupRouter;
