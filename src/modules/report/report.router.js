import * as reportController from './report.controller.js'
import { Router } from 'express';
import { authenticate } from '../../middelware/authontication.js';

const router = Router();
router.post("/generate", authenticate, reportController.generateReport);

// View reports
router.get("/viewReports", authenticate, reportController.viewReport);

// Delete report
router.delete("/deleteReport/:reportId", authenticate, reportController.deleteReport);

export default router;