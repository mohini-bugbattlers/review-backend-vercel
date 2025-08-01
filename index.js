const express = require("express");
const app = express();
const PORT = 3210;

require("dotenv").config();

const adminRoutes = require("./routes/admin");
const symbolRoutes = require("./routes/symbol");
const signalsRoutes = require("./routes/signals");
const userRoutes = require("./routes/user");

const cors = require("cors");

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const bodyParser = require("body-parser");
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
