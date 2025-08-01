const express = require('express');
const router = express.Router();
const constructorController = require('../controllers/constructor.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');
const { constructorValidation } = require('../middleware/validate.middleware');

//done
router.get('/', constructorController.getAllConstructors);
router.get('/:id', authMiddleware, constructorController.getConstructor);
router.post('/', [authMiddleware, adminOnly, constructorValidation], constructorController.createConstructor);
router.put('/:id', [authMiddleware, adminOnly, constructorValidation], constructorController.updateConstructor);
router.patch('/:id/suspend', authMiddleware, adminOnly, constructorController.toggleSuspension);
router.delete('/:id', authMiddleware, adminOnly, constructorController.deleteConstructor);

module.exports = router;
