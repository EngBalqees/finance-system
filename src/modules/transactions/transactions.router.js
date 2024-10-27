import { Router } from "express";
import * as transController from './transactions.controller.js';

import { isSuperAdmin } from "../../middelware/authorizRoles.js";
import { authenticate } from '../../middelware/authontication.js';

const router = Router();
router.post('/createTransaction',authenticate,transController.createTransaction);
router.get('/showTransaction',authenticate,transController.viewTransactions);
router.put('/updateTransaction',authenticate,transController.updateTransaction);
router.get('/userTranaction/:id',authenticate,isSuperAdmin,transController.viewTransactions);
router.delete('/deleteTranaction/:id',authenticate,transController.deleteTransaction);
export default router;