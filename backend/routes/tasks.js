const express = require('express');
const router = express.Router();
const authenticator = require('../middleware/auth');

// Dummy data array
let tasks = [
  { id: 1, taskName: 'Task 1', assignedTo: 'User 1', dueDate: new Date(2023, 11, 29), priority: 'High', taskstatus: 'In Progress' },
  { id: 2, taskName: 'Task 2', assignedTo: 'User 2', dueDate: new Date(2023, 11, 29), priority: 'High', taskstatus: 'In Progress' },
  { id: 3, taskName: 'Task 3', assignedTo: 'User 3', dueDate: new Date(2023, 11, 29), priority: 'High', taskstatus: 'In Progress' },


  // Add more dummy tasks as needed
];

// Middleware specific to the tasks route
router.use(authenticator);

// Middleware specific to the tasks route
router.use((req, res, next) => {
  console.log('Tasks route-specific middleware');
  next();
});

// Routes
router.get('/', (req, res) => {
  res.json({ tasks });
});

router.post('/add', (req, res) => {
  const { taskData } = req.body;
  const newTask = { id: tasks.length + 1, ...taskData };
  tasks.push(newTask);
  res.json({ message: 'Task added successfully', tasks });
});

router.post('/edit', (req, res) => {
  const { task, oldtask } = req.body;
  const index = tasks.findIndex(t => t.id === oldtask.id);
  if (index !== -1) {
    tasks[index] = { id: oldtask.id, ...task };
    res.json({ message: 'Task edited successfully', tasks });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

module.exports = router;
