const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config/config");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/error.middleware");
const logger = require("./middleware/logging.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const constructorRoutes = require("./routes/constructor.routes");
const projectRoutes = require("./routes/project.routes");
const reviewRoutes = require("./routes/review.routes");
const userRoutes = require("./routes/user.routes");
const reportRoutes = require("./routes/report.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://review-frontend-vercel-9x9n.vercel.app",
      "https://review-frontend.vercel.app",
      "https://review-frontend-9x9n.vercel.app",
      "https://review-frontend-9x9n-git-main-review-backend-vercel.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <== Handle preflight CORS

// Middleware
app.use(logger);
app.use(express.json());
app.use(helmet());
app.use(limiter);

// Set COOP header
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/constructors", constructorRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", commentRoutes); // Corrected from "/api" to "/api/comments" for clarity

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
