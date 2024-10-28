import * as budgetController from './budget.controller.js';
import { Router } from 'express';
import { isSuperAdmin } from "../../middelware/authorizRoles.js";
import { authenticate } from '../../middelware/authontication.js';
import router from '../transactions/transactions.router.js';

router.post('/createBudget',authenticate,budgetController.createBudget);
router.get('/getBudget',authenticate,budgetController.viewBudgets);
router.put('/updateBudget/:id',authenticate,budgetController.updateBudget);
router.delete('/deleteBudge/:id',authenticate,budgetController.deleteBudget);
router.put('/track-spending/:id',authenticate,budgetController.trackSpending);

export default router;