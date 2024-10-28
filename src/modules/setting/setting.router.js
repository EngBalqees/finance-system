import * as systemController from './setting.controller.js';
import { Router } from 'express';
import { authenticate } from '../../middelware/authontication.js';
import { isSuperAdmin } from '../../middelware/authorizRoles.js';
const router = Router();
router.get('/viewsetting', authenticate, systemController.viewSystemSettings);
router.put('/updatesetting',authenticate,systemController.updateSettings);
router.put("/reset", authenticate, isSuperAdmin, systemController.resetSettings);

export default router;