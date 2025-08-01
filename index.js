require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const symbolRoutes = require("./routes/symbol");
const signalsRoutes = require("./routes/signals");
const userRoutes = require("./routes/user");

const app = express();
const PORT = 3210;

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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <== Handle preflight CORS

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/admin", adminRoutes);
app.use("/api/symbols", symbolRoutes);
app.use("/api/signals", signalsRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
