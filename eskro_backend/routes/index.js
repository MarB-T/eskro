import express from 'express';
import userController from '../controllers/usersController.js';

const router = express.Router();

// user routes
router.post('/users');
router.get('/users/:id');
router.put('/users/:id');

// escrow routes
router.post('/escrows');
router.get('escrows:');
router.put('/escrows/:id/complete')
router.put('/escrows:id/dispute');

//

export default router;
