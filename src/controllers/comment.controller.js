const Comment = require("../models/comment.model");
const Project = require("../models/project.model");

exports.getReviewComments = async (req, res) => {
  try {
    const comments = await Comment.find({ reviewId: req.params.reviewId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    // Add like and dislike counts to each comment
    const commentsWithStats = comments.map((comment) => ({
      ...comment.toObject(),
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length,
    }));

    res.json(commentsWithStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// exports.addComment = async (req, res) => {
//   try {
//     const comment = new Comment({
//       reviewId: req.params.reviewId,
//       userId: req.user.userId,
//       text: req.body.text,
//       isBuilder: req.user.role === 'builder'
//     });
//     await comment.save();
//     res.status(201).json(comment);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.getLikesDislikes = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.addComment = async (req, res) => {
  try {
    if (req.user.role === "builder" && !req.user.isVerified) {
      return res
        .status(403)
        .json({ message: "Only verified builders can reply." });
    }

    const comment = new Comment({
      reviewId: req.params.reviewId,
      userId: req.user.userId,
      text: req.body.text,
      rating: req.body.rating, // ⭐ Accept rating here
      isBuilder: req.user.role === "builder",
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        text: req.body.text,
        rating: req.body.rating, // ⭐ Allow updating rating
      },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getReviewCommentRating = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const comments = await Comment.find({ reviewId, rating: { $ne: null } });
    if (comments.length === 0) {
      return res.json({ averageRating: null, totalComments: 0 });
    }

    const total = comments.reduce((sum, c) => sum + c.rating, 0);
    const avg = total / comments.length;

    res.json({
      averageRating: avg.toFixed(1),
      totalComments: comments.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { message } = req.body;
  const userId = req.user._id;

  try {
    // Get the comment being replied to
    const parentComment = await Comment.findById(commentId);
    if (!parentComment)
      return res.status(404).json({ message: "Comment not found" });

    // Get the associated project
    const project = await Project.findById(parentComment.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🔐 Check if logged-in user is the builder of THIS project
    if (!project.builderId || String(project.builderId) !== String(userId)) {
      return res.status(403).json({
        message: "You are not the builder of this project. Reply not allowed.",
      });
    }

    // Create reply
    const reply = await Comment.create({
      projectId: project._id,
      userId,
      parentCommentId: commentId,
      message,
    });

    res.status(201).json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Remove user from dislikes if present
    comment.dislikes = comment.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Toggle like
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ message: "Like status updated", likes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Remove user from likes if present
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Toggle dislike
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.dislikes.push(userId);
    }

    await comment.save();
    res.json({
      message: "Dislike status updated",
      dislikes: comment.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
