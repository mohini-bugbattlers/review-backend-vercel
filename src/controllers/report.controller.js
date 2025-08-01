const Review = require('../models/review.model');
const User = require('../models/user.model');
const Constructor = require('../models/constructor.model');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      Constructor.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' })
    ]);

    res.json({
      totalUsers: stats[0],
      totalConstructors: stats[1],
      totalReviews: stats[2],
      pendingReviews: stats[3]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReviewStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const reviews = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getConstructorStats = async (req, res) => {
  try {
    const stats = await Constructor.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalActive: {
            $sum: { $cond: [{ $eq: ['$suspended', false] }, 1, 0] }
          },
          totalSuspended: {
            $sum: { $cond: [{ $eq: ['$suspended', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateCustomReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.body;
    let data;

    switch(type) {
      case 'users':
        data = await User.find({
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).select('-password');
        break;
      case 'reviews':
        data = await Review.find({
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        break;
      case 'constructors':
        data = await Constructor.find({
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({ type, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
