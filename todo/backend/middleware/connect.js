const mongoose = require('mongoose');


async function connectToMongoDB() {
    
    try {
      const db = await mongoose.connect(
            process.env.MONGODB_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
  
      console.log("Connected to MongoDB");
      return db;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  
  }
  
module.exports = {connectToMongoDB};