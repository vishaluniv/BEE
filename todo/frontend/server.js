const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the cors middleware

const app = express();
// app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');

// });
// Serve static files from the 'public' directory
app.use(express.static(('public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'index.html'));
});

app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'task.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
