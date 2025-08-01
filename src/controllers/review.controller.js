const Review = require("../models/review.model");
const Constructor = require("../models/constructor.model");
// / Like a review
exports.likeReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID
    const userId = req.user.userId; // From JWT token

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user already disliked the review
    if (review.dislikes.includes(userId)) {
      // Remove dislike if switching to like
      review.dislikes = review.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Toggle like
    if (review.likes.includes(userId)) {
      // Remove like if already liked
      review.likes = review.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add like
      review.likes.push(userId);
    }

    await review.save();
    res.json({ message: "Like updated", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Dislike a review
// exports.dislikeReview = async (req, res) => {
//   try {
//     const { id } = req.params; // Review ID
//     const userId = req.user.userId; // From JWT token

//     const review = await Review.findById(id);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // Check if user already liked the review
//     if (review.likes.includes(userId)) {
//       // Remove like if switching to dislike
//       review.likes = review.likes.filter(
//         (id) => id.toString() !== userId.toString()
//       );
//     }

//     // Toggle dislike
//     if (review.dislikes.includes(userId)) {
//       // Remove dislike if already disliked
//       review.dislikes = review.dislikes.filter(
//         (id) => id.toString() !== userId.toString()
//       );
//     } else {
//       // Add dislike
//       review.dislikes.push(userId);
//     }

//     await review.save();
//     res.json({ message: "Dislike updated", review });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
exports.getReviewRating = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ rating: review.rating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.dislikeReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID
    const userId = req.user.userId; // From JWT token

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user already liked the review
    if (review.likes.includes(userId)) {
      // Remove like if switching to dislike
      review.likes = review.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Toggle dislike
    if (review.dislikes.includes(userId)) {
      // Remove dislike if already disliked
      review.dislikes = review.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add dislike
      review.dislikes.push(userId);
    }

    await review.save();
    res.json({ message: "Dislike updated", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... Rest of your existing endpoints ...

// Update existing endpoints to include likes/dislikes in responses
exports.getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("constructorId", "name")
      .skip((page - 1) * limit)
      .limit(limit);
    // Add like/dislike counts to response
    const reviewsWithCounts = reviews.map((review) => ({
      ...review.toJSON(),
      likeCount: review.likes.length,
      dislikeCount: review.dislikes.length,
    }));
    res.json(reviewsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name")
      .populate("constructorId", "name");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    // Add like/dislike counts to response
    const reviewWithCounts = {
      ...review.toJSON(),
      likeCount: review.likes.length,
      dislikeCount: review.dislikes.length,
    };
    res.json(reviewWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjectReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ projectId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    // Add like/dislike counts to response
    const reviewsWithCounts = reviews.map((review) => ({
      ...review.toJSON(),
      likeCount: review.likes.length,
      dislikeCount: review.dislikes.length,
    }));
    res.json(reviewsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getConstructorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ constructorId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    // Add like/dislike counts to response
    const reviewsWithCounts = reviews.map((review) => ({
      ...review.toJSON(),
      likeCount: review.likes.length,
      dislikeCount: review.dislikes.length,
    }));
    res.json(reviewsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (status === "approved") {
      await updateConstructorRating(review.constructorId);
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name")
      .populate("constructorId", "name");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjectReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ projectId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getConstructorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ constructorId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment, constructorId, projectId, detailedRatings } = req.body;

    const review = new Review({
      rating,
      comment,
      constructorId,
      projectId,
      detailedRatings,
      userId: req.user.userId,
      status: "approved", // or "pending" if moderation is used
    });

    await review.save();

    await updateConstructorRating(constructorId);

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await updateConstructorRating(review.constructorId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateConstructorRating(constructorId) {
  const approvedReviews = await Review.find({
    constructorId,
    status: "approved",
  });

  const totalRating = approvedReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating = totalRating / approvedReviews.length;

  await Constructor.findByIdAndUpdate(constructorId, {
    rating: averageRating,
    reviewCount: approvedReviews.length,
  });
}
// Get like/dislike status for a review by a specific user
exports.getReviewLikeStatus = async (req, res) => {
  try {
    const { id } = req.params; // Review ID
    const userId = req.user.userId; // From JWT token

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user has liked or disliked the review
    const likeStatus = {
      liked: review.likes.includes(userId),
      disliked: review.dislikes.includes(userId)
    };

    res.json(likeStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
