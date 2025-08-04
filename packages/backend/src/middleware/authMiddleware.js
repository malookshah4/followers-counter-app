import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the request header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the user's ID to the request object for other routes to use
    req.user = { id: decoded.userId };

    // 4. Proceed to the next function (the actual route handler)
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

export default authMiddleware;