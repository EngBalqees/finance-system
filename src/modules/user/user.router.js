import * as userController from './user.controller.js';
import { authorizeRoles }  from '../../middelware/authorizRoles.js';
import { authenticate } from '../../middelware/authontication.js';
import { Router } from 'express';
const router = Router();

router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);
router.put('/updateProfile',authenticate,userController.updateProfile);
router.put('/changePassword',authenticate,userController.changePassword);

router.get('/users/getAllUsers',authenticate,authorizeRoles('superAdmin'),userController.viewAllUsers);
router.delete('/users/deleteuser/:id',authenticate,authorizeRoles('superAdmin'),userController.deleteUser);
router.put('/users/:id/status',authenticate,authorizeRoles('superAdmin'),userController.updateUserStatus);
router.put('/users/:id/role',authenticate,authorizeRoles('superAdmin'),userController.updateUserRole);

export default router;