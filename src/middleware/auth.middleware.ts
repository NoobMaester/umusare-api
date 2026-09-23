import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthTokenPayload {
  sub: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization header",
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.sub !== "string" ||
      typeof decoded.role !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const payload = decoded as AuthTokenPayload;

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}