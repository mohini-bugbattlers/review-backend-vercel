const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

// ✅ Keep static routes before dynamic ones
router.get('/verified-builders', authMiddleware, userController.getVerifiedBuilders);
router.put('/verify-builder/:id', authMiddleware, adminOnly, userController.verifyBuilder);

router.get('/', authMiddleware, adminOnly, userController.getAllUsers);
router.put('/:id', authMiddleware, adminOnly, userController.updateUser);
router.patch('/:id/toggle-status', authMiddleware, adminOnly, userController.toggleUserStatus);
router.get('/:id', authMiddleware, adminOnly, userController.getUser);
router.delete('/:id', authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;
