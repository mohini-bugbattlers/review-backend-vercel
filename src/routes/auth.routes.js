const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { loginValidation } = require("../middleware/validate.middleware");

// Single login endpoint
router.post("/login", loginValidation, authController.login);

// Admin signup
router.post(
  "/admin/signup",
  (req, res, next) => {
    req.body.role = "admin";
    next();
  },
  authController.register
);

// Customer signup
router.post(
  "/customer/signup",
  (req, res, next) => {
    req.body.role = "customer";
    next();
  },
  authController.register
);
router.post("/customer/send-otp", authController.sendCustomerOTP);
router.post("/customer/verify-otp", authController.verifyOTP);

// Builder signup
router.post(
  "/builder/signup",
  (req, res, next) => {
    req.body.role = "builder";
    next();
  },
  authController.register
);

router.post("/builder/send-otp", authController.sendBuilderOTP);
router.post("/builder/verify-otp", authController.verifyOTP);

// Common routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.put("/change-password", authMiddleware, authController.changePassword);

// Google & Facebook OAuth
router.post("/login/google", authController.googleLogin);
router.post("/login/facebook", authController.facebookLogin);

module.exports = router;
