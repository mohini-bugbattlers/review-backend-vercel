const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const symbolController = require("../controllers/symbol");

router.use(authMiddleware.isAdmin);

router.get("/", symbolController.getSymbols);

module.exports = router;
