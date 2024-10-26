import jwt from 'jsonwebtoken'


export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied: no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info (including role) to req.user
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
