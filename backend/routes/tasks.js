const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Adjust the path based on your project structure
const Task = require('../model/task'); // Adjust the path based on your project structure
const {connectToMongoDB} = require('../middleware/connect');
const {generateShortTaskID} = require('../middleware/generateID');


router.use(auth);

// Get all tasks for a user
router.get('/all', async (req, res) => {

  try {
    // Find all tasks for the authenticated user
    await connectToMongoDB();
    const tasks = await Task.find({ username: req.user });
    res.json({ tasks: tasks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});


router.post('/add',async (req, res) => {
  try {
    const { taskName, assignedTo, dueDate, priority, taskstatus } = req.body;
    await connectToMongoDB();
    const username = req.user;
    const nID = generateShortTaskID();
    // Create a new task
    const newTask = new Task({
      taskID:nID,
      username: username,
      taskName: taskName,
      assignedTo: assignedTo,
      dueDate: dueDate,
      priority: priority,
      taskstatus: taskstatus
    });

    // Save the task to the database
    
    await newTask.save();

    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit a task
router.post('/edit',  async (req, res) => {
  try {
    const { taskID, taskName, assignedTo, dueDate, priority, taskstatus } = req.body;
    const username = req.user;
    await connectToMongoDB();

    // Find the task by ID
    const task = await Task.findOne({ taskID: taskID, username: username });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task details
    task.taskName = taskName;
    task.assignedTo = assignedTo[0];
    task.dueDate = dueDate;
    task.priority = priority;
    task.taskstatus = taskstatus;

    // Save the updated task
    await task.save();

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a task
router.delete('/delete',  async (req, res) => {
  try {
    const {taskID} = req.body;
    await connectToMongoDB();
    
    // Find the task by ID and user
    const task = await Task.findOneAndDelete({ taskID: taskID });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

module.exports = router;
