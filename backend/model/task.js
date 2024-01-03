const mongoose = require("mongoose");

// Define a Mongoose schema that corresponds to the Task class
const taskSchema = new mongoose.Schema({
    taskID: {
        type: Number,
        required: true,
    },
    
  username :{
    type: String,
    required: true
  },
  taskName: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
    default: "User",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
    required: true,
  },
  taskstatus: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
    required: true,
  },
});

// Create a Mongoose model from the schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
