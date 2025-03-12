const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token is provided
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user data to the request
        req.user = decoded;
        
        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
