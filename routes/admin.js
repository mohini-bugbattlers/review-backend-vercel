const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const adminController = require("../controllers/admin");

router.use(authMiddleware.isAdmin);

router.get("/", (req, res) => {
  res.send("Hello from admin");
});

router.post("/login", adminController.login);
router.get("/admins", adminController.getAdmins);
router.post("/admins", adminController.createAdmin);
router.put("/admins/:id", adminController.updateAdmin);
router.delete("/admins/:id", adminController.deleteAdmin);

module.exports = router;
