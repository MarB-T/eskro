import express from 'express';
import UsersController from '../controllers/usersController.js';
import ContractController from '../controllers/contractController.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { mpesaStkPush, mpesaCallback } from '../utils/mpesaSTK.js';

const router = express.Router();
const usersController = new UsersController();
const contractController = new ContractController();

// user routes
router.get('/users', verifyAccessToken, usersController.getAllUsers);
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser);
router.get('/users/:id');
router.put('/users/:id');
router.delete('/users/:id');
router.post('refresh-token', usersController.refreshToken);
router.post('/logout', usersController.logoutUser);

// eskrow routes
router.post('/createContract', verifyAccessToken, contractController.createContract);
router.get('/contracts', verifyAccessToken, contractController.getContracts);
router.put('/contract/pay/:id', verifyAccessToken, contractController.updatePayment);
// router.put('/contract/condition/:id', verifyAccessToken, contractController.updateCondition);
// router.put('/escrows:id/dispute');
router.post('/mpesaSTK', mpesaStkPush);
router.post('/callback', mpesaCallback);
//

export default router;
