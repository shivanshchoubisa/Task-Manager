const taskService = require('../services/task.service');

const getTasks = (req, res, next) => {
  try {
    const { tasks, meta } = taskService.getAll(req.query);
    res.status(200).json({ success: true, data: tasks, meta });
  } catch (err) {
    next(err);
  }
};

const getTask = (req, res, next) => {
  try {
    const task = taskService.getById(req.params.id);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const createTask = (req, res, next) => {
  try {
    const task = taskService.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const updateTask = (req, res, next) => {
  try {
    const task = taskService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const task = taskService.remove(req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };