const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get(
  "/review/:reviewId/comments",
  authMiddleware,
  commentController.getReviewComments
);
router.post(
  "/review/:reviewId/comments",
  authMiddleware,
  commentController.addComment
);
router.put("/comments/:id", authMiddleware, commentController.updateComment);
router.delete("/comments/:id", authMiddleware, commentController.deleteComment);
router.post(
  "/comments/reply/:commentId",
  authMiddleware,
  commentController.replyToComment
);
router.post("/like/:commentId", authMiddleware, commentController.likeComment);
router.post(
  "/dislike/:reviewId",
  authMiddleware,
  commentController.dislikeComment
);
router.get(
  "/likes-dislikes/:reviewId",
  authMiddleware,
  commentController.getLikesDislikes
);

router.get(
  "/review/:reviewId/average-rating",
  authMiddleware,
  commentController.getReviewCommentRating
);

module.exports = router;
