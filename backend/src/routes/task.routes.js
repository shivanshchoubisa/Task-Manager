const express = require('express');
const controller = require('../controllers/task.controller');
const validateTask = require('../middleware/validateTask');

const router = express.Router();

router.get('/', controller.getTasks);
router.get('/:id', controller.getTask);
router.post('/', validateTask(false), controller.createTask);
router.put('/:id', validateTask(true), controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;