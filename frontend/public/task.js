document.addEventListener("DOMContentLoaded", async function () {
  console.log("request sent");

  async function getTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/tasks/all", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Success:", data);
      return data.tasks;

      // Perform actions with the retrieved data
    } catch (error) {
      console.error("Error:", error);
      throw error; // rethrow the error to be caught by the calling code if needed
    }

  }

  const tasks = await getTasks();
  sampleTasks = tasks;
  console.log(tasks);
  loadSampleTasks(sampleTasks);

});

async function addTaskBack(taskData) {
  console.log(taskData);
  taskName = taskData.taskName;
  assignedTo = taskData.assignedTo;
  dueDate = taskData.dueDate;
  priority = taskData.priority;
  taskstatus = taskData.taskstatus;
  try {
    const response = await fetch("http://localhost:3000/api/tasks/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Include the authorization header
      },
      body: JSON.stringify({ taskName, assignedTo, dueDate, priority, taskstatus }),
    });

    const data = await response.json();
    console.log("Success:", data);

    // Perform actions with the retrieved data
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be caught by the calling code if needed
  }

  // Send a POST request to the API to add the task
}

//EDIT TASK -- BACKEND

async function editTaskBack(task, taskID) {
  console.log(task);
  taskName = task.taskName;
  assignedTo = task.assignedTo;
  dueDate = task.dueDate;
  priority = task.priority;
  taskstatus = task.taskstatus;
  try {
    const response = await fetch("http://localhost:3000/api/tasks/edit", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Include the authorization header
      },
      body: JSON.stringify({ taskID, taskName, assignedTo, dueDate, priority, taskstatus }),
    });

    const data = await response.json();
    console.log("Success:", data);

    // Perform actions with the retrieved data
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be caught by the calling code if needed
  }
}

//COMPLETE TASK --- BACKEND

let sampleTasks;

const addTaskButton = document.getElementById("addTaskButton");

addTaskButton.addEventListener("click", function () {
  console.log("clicked");
  const addTaskModal = new bootstrap.Modal(
    document.getElementById("addTaskModal")
  );
  addTaskModal.show();
});

function loadSampleTasks(sampleTasks) {
  const tasksTable = document.getElementById("tasksTable");
  tasksTable.innerHTML = "";

  sampleTasks.forEach((task, index) => {
    const row = tasksTable.insertRow(task[0]);

    createTableCell(row, `<h6 class="mb-0 text-sm">${task.taskName}</h6>`);
    createTableCell(row, task.assignedTo);
    createTableCell(row, new Date(task.dueDate).toDateString());
    createTableCell(row, task.priority);
    createTableCell(row, task.taskstatus);

    const actionsCell = row.insertCell(5);
    createActionsDropdown(actionsCell, task.taskID);
  });
}

function createTableCell(row, content) {
  const cell = row.insertCell();
  cell.innerHTML = content;
}

function createActionsDropdown(cell, taskId) {
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");

  dropdown.innerHTML = `
<button class="btn btn-sm bg-gradient-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Actions
</button>
<div class="dropdown-menu">
    <a class="dropdown-item" href="javascript:;" onclick="handleEditTaskClick(${taskId})">Edit</a>
    <a class="dropdown-item" href="javascript:;">Delete</a>
    <a class="dropdown-item" href="javascript:;">Completed</a>
</div>
`;

  cell.appendChild(dropdown);
}

async function addTask(newTask) {
  if (!sampleTasks) {
    sampleTasks = [];
  }
  sampleTasks.push(newTask);
  await addTaskBack(newTask);
}

// Event listener for the "Add Task" button to show the modal

// Event listener for the task form submission
const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const assignedTo = document.getElementById("assignedTo").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const taskstatus = document.getElementById("status").value;

  // Validate input (add your own validation logic)

  // Create a new task object
  const newTask = {
    taskName,
    assignedTo,
    dueDate,
    priority,
    taskstatus,
  };
  console.log(newTask);
  // Add the new task to the sampleTasks array
  await addTask(newTask);

  // Close the modal
  const addTaskModal = new bootstrap.Modal(
    document.getElementById("addTaskModal")
  );
  addTaskModal.hide();

  // Reload the tasks
  loadSampleTasks(sampleTasks);
});

function handleEditTaskClick(taskId) {
  console.log("wrong place");
  const taskToEdit = sampleTasks.find((task) => task.taskID === taskId);

  const taskNameInput = document.getElementById("taskNameEdit");
  const assignedToInput = document.getElementById("assignedToEdit");
  const dueDateInput = document.getElementById("dueDateEdit");
  const priorityInput = document.getElementById("priorityEdit");
  const statusInput = document.getElementById("statusEdit");

  taskNameInput.value = taskToEdit.taskName;
  assignedToInput.value = taskToEdit.assignedTo;
  dueDateInput.value = taskToEdit.dueDate;
  priorityInput.value = taskToEdit.priority;
  statusInput.value = taskToEdit.taskstatus;

  const editTaskModal = new bootstrap.Modal(
    document.getElementById("editTaskModal")
  );
  editTaskModal.show();

  const editTaskForm = document.getElementById("editTaskForm");

  // Remove any existing event listener before adding a new one
  editTaskForm.removeEventListener("submit", handleEditTaskSubmit);

  // Add a new event listener
  editTaskForm.addEventListener("submit", handleEditTaskSubmit);

  // Store the task ID as a property of the form
  editTaskForm.taskId = taskId;
  editTaskForm.task = taskToEdit;
  editTaskForm.modal = editTaskModal;
}

async function handleEditTaskSubmit(e) {
  console.log("where me supposed to be");
  e.preventDefault();

  const taskId = e.currentTarget.taskId;
  const taskToEdit = sampleTasks.find((task) => task.taskID === taskId);

  // Clone the task object to avoid reference issues
  const updatedTask = Object.assign({}, taskToEdit);

  updatedTask.taskName = e.currentTarget.querySelector("#taskNameEdit").value;
  updatedTask.assignedTo = e.currentTarget
    .querySelector("#assignedToEdit")
    .value.split(",")
    .map((member) => member.trim());
  updatedTask.dueDate = e.currentTarget.querySelector("#dueDateEdit").value;
  updatedTask.priority = e.currentTarget.querySelector("#priorityEdit").value;
  updatedTask.taskstatus = e.currentTarget.querySelector("#statusEdit").value;

  // Find the index of the task in the sampleTasks array
  const taskIndex = sampleTasks.findIndex((task) => task.taskID === taskId);

  // Update the task in the sampleTasks array with the updatedTask
  sampleTasks[taskIndex] = updatedTask;

  await editTaskBack(updatedTask, taskId);

  // Hide the editTaskModal
  const editTaskModal = new bootstrap.Modal(
    document.getElementById("editTaskModal")
  );
  editTaskModal.hide();

  loadSampleTasks(sampleTasks);
}
