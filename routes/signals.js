const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const signalsController = require("../controllers/signals");

router.use(authMiddleware.isAdmin);

router.get("/", signalsController.getSignals);
router.post("/", signalsController.addSignal);
router.put("/:id", signalsController.updateSignal);
router.delete("/:id", signalsController.deleteSignal);


module.exports = router;
