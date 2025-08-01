const { validationResult, body } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    next();
  };
};

exports.loginValidation = validate([
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]);

exports.constructorValidation = validate([
  body('name').notEmpty(),
  body('specialization').notEmpty(),
  body('location').notEmpty(),
  body('contactInfo.email').optional().isEmail(),
  body('contactInfo.phone').optional().isMobilePhone()
]);

exports.reviewValidation = validate([
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').notEmpty(),
  body('detailedRatings.*').optional().isInt({ min: 1, max: 5 })
]);

exports.userValidation = validate([
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('phone').optional().isMobilePhone(),
  body('role').optional().isIn(['admin', 'customer', 'builder'])
]);

exports.projectValidation = validate([
  body('name').notEmpty(),
  body('description').notEmpty(),
  body('constructorId').isMongoId(),
  body('location').notEmpty(),
  body('status').optional().isIn(['ongoing', 'completed', 'planned'])
]);

exports.commentValidation = validate([
  body('text').notEmpty().trim()
]);
