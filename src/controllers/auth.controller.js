const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const googleClient = new OAuth2Client();
// Send SMS
const sendSMS = async (phoneNumber, message) => {
  try {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const smsUrl = `http://bhashsms.com/api/sendmsg.php?user=Bugbattlers_Technologies&pass=123456&sender=ADNILA&phone=${cleanPhone}&text=${encodeURIComponent(
      message
    )}&priority=ndnd&stype=normal`;

    const response = await axios.get(smsUrl, { timeout: 30000 });
    const responseText = response.data?.toString().trim();
    if (
      responseText.includes("Success") ||
      responseText.includes("sent") ||
      responseText.startsWith("S.")
    ) {
      return { success: true, response: responseText };
    } else {
      return { success: false, response: responseText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send Email
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mohini.bugbattlers@gmail.com",
        pass: "dpbx xdeu bmow nmnr",
      },
    });

    const mailOptions = {
      from: '"PGEZY" <your-email@gmail.com>',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send Customer OTP
exports.sendCustomerOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Either email or phone number is required" });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  //  await User.findOne({ email });

    const message = `Your OTP to log in to PGEZY account is ${otp}. Please do not share this with anyone. It is valid for 5 minutes. - Team Adinila Technologies`;

    const smsResult = user.phone
      ? await sendSMS(user.phone, message)
      : { success: false };
    const emailResult = user.email
      ? await sendEmail(user.email, "OTP for PGEZY Login", message)
      : { success: false };

    if (smsResult.success || emailResult.success) {
      return res.json({
        message: `OTP sent successfully ${smsResult.success ? "via SMS" : ""}${
          emailResult.success
            ? smsResult.success
              ? " and Email"
              : "via Email"
            : ""
        }`,
      });
    } else {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(500).json({
        message: "Failed to send OTP",
        error: smsResult.error || emailResult.error,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

// Send Builder OTP
exports.sendBuilderOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Either email or phone number is required" });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: "Builder not found" });
    if (user.role !== "builder")
      return res.status(403).json({
        message: "Access denied. This endpoint is for builders only.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const message = `Your OTP to log in to PGEZY account is ${otp}. Please do not share this with anyone. It is valid for 5 minutes. - Team Adinila Technologies`;

    const smsResult = user.phone
      ? await sendSMS(user.phone, message)
      : { success: false };
    const emailResult = user.email
      ? await sendEmail(user.email, "OTP for PGEZY Login", message)
      : { success: false };

    if (smsResult.success || emailResult.success) {
      return res.json({
        message: `OTP sent successfully ${smsResult.success ? "via SMS" : ""}${
          emailResult.success
            ? smsResult.success
              ? " and Email"
              : "via Email"
            : ""
        }`,
      });
    } else {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(500).json({
        message: "Failed to send OTP",
        error: smsResult.error || emailResult.error,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

// Login Endpoint
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting login with email:", email);
    const user = await User.findOne({ email });
    console.log("User retrieved from database:", user);
    if (!user) {
      console.log("No user found with that email");
      return res
        .status(401)
        .json({ message: "Invalid credentials: No user found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    if (!isMatch) {
      console.log("Password does not match");
      return res
        .status(401)
        .json({ message: "Invalid credentials: Password does not match" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register Endpoint
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, licenseNumber, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      licenseNumber,
      phone,
      isVerified: role === "builder" ? false : true,
    });
    console.log("User object before saving:", user);
    await user.save();
    res
      .status(201)
      .json({ message: `${role || "customer"} created successfully` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP Endpoint
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Either email or phone is required" });
    }
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.otp || !user.otpExpires) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new OTP." });
    }
    const isOtpValid = user.otp === otp && user.otpExpires > new Date();
    if (!isOtpValid) {
      if (user.otpExpires <= new Date()) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res
          .status(400)
          .json({ message: "OTP has expired. Please request a new OTP." });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
    res.json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res
      .status(500)
      .json({ message: "Failed to verify OTP", error: error.message });
  }
};

// Get Profile Endpoint
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Profile Endpoint
exports.updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user.userId) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.phone = phoneNumber || user.phone;
    user.email = email || user.email;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

// Change Password Endpoint
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log("Received token:", token); // Debug
  if (!token) {
    return res
      .status(400)
      .json({ message: "Google login failed", error: "No ID token provided" });
  }
  try {
    // Initialize Google OAuth2 client
    const googleClient = new google.auth.OAuth2();

    // Verify token without audience check
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
    });
    const { email, name, sub: googleId } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if none exists
      user = new User({
        email,
        name,
        googleId, // Store Google ID for reference
        role: "customer", // Default role; adjust as needed
        // Add other default fields as required by your User schema
        // e.g., password: null, createdAt: new Date(), etc.
      });
      await user.save();
      console.log("New user created:", user.email); // Debug
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken, user });
  } catch (err) {
    console.error("Google login error:", err);
    res
      .status(400)
      .json({ message: "Google login failed", error: err.message });
  }
};
// Facebook Login Endpoint
exports.facebookLogin = async (req, res) => {
  const { accessToken, userID } = req.body;
  try {
    const fbUrl = `https://graph.facebook.com/v10.0/${userID}?fields=id,name,email&access_token=${accessToken}`;
    const { data } = await axios.get(fbUrl);
    const { email, name } = data;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "Account not found. Please register first." });
    }
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    res.json({ token: jwtToken, user });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Facebook login failed", error: err.message });
  }
};
