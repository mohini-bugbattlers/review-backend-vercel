const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

router.get('/constructor/:constructorId', projectController.getConstructorProjects);
router.post('/', authMiddleware, adminOnly, projectController.createProject);
router.put('/:id', authMiddleware, adminOnly, projectController.updateProject);
router.get('/:id', authMiddleware, projectController.getProject);
router.delete('/:id', authMiddleware, adminOnly, projectController.deleteProject);

module.exports = router;
