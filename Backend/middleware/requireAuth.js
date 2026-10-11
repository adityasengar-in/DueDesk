
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.ownerId = jwt.verify(token, process.env.JWT_SECRET).ownerId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = requireAuth;