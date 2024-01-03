const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Adjust the path based on your project structure
const {connectToMongoDB} = require('./connect');
const auth = async (req, res, next) => {
  try {
    // Check if the request contains cookies
    console.log(req.cookies);
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToMongoDB();
    const user = await User.findOne({username: decoded.userId});

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid user' });
    }

    // Attach the user object to the request for later use
    req.user = user.username;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};



module.exports = auth;
