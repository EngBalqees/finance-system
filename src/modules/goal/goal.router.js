import { Router } from "express";
import * as goalController from './goal.controller.js'
import { authenticate } from "../../middelware/authontication.js";


const router = Router();
router.post("/createGoal", authenticate, goalController.createGoal);
router.put("/updateAmount/:goalId", authenticate, goalController.updateSavedAmount);

// General route for viewing goals
router.get("/viewGoals", authenticate, goalController.viewGoals);

// Routes allowing both users and super admin to update and delete
router.put("/updateGoal/:goalId", authenticate, goalController.updateGoal);
router.delete("/deleteGoal/:goalId", authenticate, goalController.deleteGoal);

export default router;