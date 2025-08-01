const Constructor = require('../models/constructor.model');

exports.getAllConstructors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const constructors = await Constructor.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Constructor.countDocuments();

    res.json({
      constructors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createConstructor = async (req, res) => {
  try {
    const constructor = new Constructor(req.body);
    await constructor.save();
    res.status(201).json(constructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateConstructor = async (req, res) => {
  try {
    const constructor = await Constructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!constructor) {
      return res.status(404).json({ message: 'Constructor not found' });
    }
    res.json(constructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleSuspension = async (req, res) => {
  try {
    const constructor = await Constructor.findById(req.params.id);
    if (!constructor) {
      return res.status(404).json({ message: 'Constructor not found' });
    }
    
    constructor.suspended = !constructor.suspended;
    await constructor.save();
    
    res.json({ message: `Constructor ${constructor.suspended ? 'suspended' : 'activated'}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getConstructor = async (req, res) => {
  try {
    const constructor = await Constructor.findById(req.params.id);
    if (!constructor) {
      return res.status(404).json({ message: 'Constructor not found' });
    }
    res.json(constructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteConstructor = async (req, res) => {
  try {
    const constructor = await Constructor.findByIdAndDelete(req.params.id);
    if (!constructor) {
      return res.status(404).json({ message: 'Constructor not found' });
    }
    res.json({ message: 'Constructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
