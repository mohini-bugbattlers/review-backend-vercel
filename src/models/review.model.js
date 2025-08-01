const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    constructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constructor",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who disliked
    detailedRatings: {
      projectLocation: { type: Number, min: 1, max: 5 },
      constructionQuality: { type: Number, min: 1, max: 5 },
      amenities: { type: Number, min: 1, max: 5 },
      parkingFacilities: { type: Number, min: 1, max: 5 },
      waterSupply: { type: Number, min: 1, max: 5 },
      plumbingQuality: { type: Number, min: 1, max: 5 },
      electricalFittings: { type: Number, min: 1, max: 5 },
      clubHouse: { type: Number, min: 1, max: 5 },
      gardenChildrenPlayArea: { type: Number, min: 1, max: 5 },
      buildingElevation: { type: Number, min: 1, max: 5 },
    },
    images: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
