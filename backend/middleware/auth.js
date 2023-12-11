// Dummy authentication middleware
const authenticator = (req, res, next) => {
    const { authorization } = req.headers;
  
    // Check if an authorization token is present
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
  
    // For simplicity, let's assume a valid token is 'mysecrettoken'
    const validToken = 'secret';
  
    // Check if the token is valid
    if (authorization !== `Bearer ${validToken}`) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
  
    // If the token is valid, proceed to the next middleware/route
    next();
  };
  
  module.exports = authenticator;
  