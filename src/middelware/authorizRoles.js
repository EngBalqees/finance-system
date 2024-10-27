// Middleware to authorize based on roles
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    try {
      // Check if user has a role that matches any of the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
      next(); // Allow access if role is authorized
    } catch (error) {
      res.status(500).json({ message: "Error authorizing role", error });
    }
  };
  
  export const isSuperAdmin = (req, res, next) => {
    if (req.user.role === "superadmin") return next();
    return res.status(403).json({ message: "Access denied" });
  };
  