function generateShortTaskID() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random number between 0 and 999
  
    // Format: timestamp + random
    const taskID = timestamp + random;
  
    return taskID;
  }

module.exports = {generateShortTaskID};
  