const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.username;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = {
  authMiddleware,
};
