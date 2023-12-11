const express = require('express');
const app = express();
const cors = require('cors'); // Import the cors middleware

const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware
// const logger = require('./middleware/logger');
// app.use(logger);
app.use(express.json());

// Routes
const tasksRoutes = require('./routes/tasks');
app.use('/api/tasks', tasksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
