const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

// Existing routes
router.get('/', authMiddleware, reviewController.getAllReviews);
router.get('/:id', authMiddleware, reviewController.getReview);
router.get('/project/:id', authMiddleware, reviewController.getProjectReviews);
router.get('/constructor/:id', authMiddleware, reviewController.getConstructorReviews);
router.post('/', authMiddleware, reviewController.createReview);
router.patch('/:id/moderate', authMiddleware, adminOnly, reviewController.moderateReview);
router.delete('/:id', authMiddleware, adminOnly, reviewController.deleteReview);

// New routes for liking and disliking reviews
router.post('/:id/like', authMiddleware, reviewController.likeReview);
router.post('/:id/dislike', authMiddleware, reviewController.dislikeReview);
router.get('/:id/like-status', authMiddleware, reviewController.getReviewLikeStatus);
router.get('/:id/rating', authMiddleware, reviewController.getReviewRating);


module.exports = router;
