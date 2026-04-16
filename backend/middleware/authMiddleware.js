import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expected format: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user info to request
    req.user = decoded; 
    // example decoded:
    // { id: 1, email: "...", role: "physio", iat, exp }

    next(); // ✅ allow request to continue

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized / Token expired" });
  }
};

export default authMiddleware;
