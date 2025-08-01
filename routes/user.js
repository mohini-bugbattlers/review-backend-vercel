const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

//admin routes
router.get("/", auth.isAdmin, userController.getUsers);
router.post("/", auth.isAdmin, userController.addUser);

//user routes
router.post("/login", userController.login);
router.get("/", auth.isUser, userController.getUser);
router.put("/", auth.isUser, userController.updateUser);
router.delete("/", auth.isUser, userController.deleteUser);

module.exports = router;
