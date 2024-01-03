const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const {connectToMongoDB} = require('../middleware/connect');

require('dotenv').config(); 

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    await connectToMongoDB();
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {

  try {
    const { username, password } = req.body;

    // Find the user by username
    await connectToMongoDB();
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: username }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); // 'maxAge' is in milliseconds

// Send a JSON response without the token
    res.json({ message: 'Authentication successful', username: username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
