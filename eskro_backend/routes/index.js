import express from 'express';
import UsersController from '../controllers/usersController.js';
import { verifyAccessToken } from '../utils/jwt.js';

const router = express.Router();
const usersController = new UsersController();

// user routes
router.get('/users', verifyAccessToken, usersController.getAllUsers);
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser);
router.get('/users/:id');
router.put('/users/:id');

// escrow routes
router.post('/escrows');
router.get('escrows:');
router.put('/escrows/:id/complete')
router.put('/escrows:id/dispute');

//

export default router;
