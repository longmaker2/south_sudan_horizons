import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  try {
    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id?: string;
      userId?: string;
      _id?: string;
    };
    console.log("Decoded token:", decoded);

    req.userId = decoded.id || decoded.userId || decoded._id;
    if (!req.userId) {
      throw new Error("No valid user ID found in token");
    }
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token." });
  }
};

export default authenticateUser;
