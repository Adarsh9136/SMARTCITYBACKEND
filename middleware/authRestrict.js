
// Middleware to restrict access based on user roles
const restrictTo = (allowedRoles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!req.user || !req.user.role || !allowedRoles.some(role => req.user.role.includes(role))) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }
    next(); // User has the required role, continue to the next middleware
  };
};

module.exports = restrictTo ;
