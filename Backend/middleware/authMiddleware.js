
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Please log in to access this resource."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({
        message: "Invalid session token."
      });
    }

    req.userId = decoded.userId;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired session. Please log in again."
    });
  }
};

export default authMiddleware;
