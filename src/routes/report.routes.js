const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

router.get('/dashboard-stats', authMiddleware, adminOnly, reportController.getDashboardStats);
router.get('/review-stats', authMiddleware, adminOnly, reportController.getReviewStats);
router.get('/constructor-stats', authMiddleware, adminOnly, reportController.getConstructorStats);
router.get('/users', authMiddleware, adminOnly, reportController.getUserReports);
router.post('/generate', authMiddleware, adminOnly, reportController.generateCustomReport);

module.exports = router;
