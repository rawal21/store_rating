import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../../user/user.service";
import type { IUser } from "../../user/user.dto";
import createHttpError from "http-errors";

export interface AuthRequest extends Request {
  user?: Omit<IUser, "passwordHash">;
}

type Role = IUser["role"];

/**
 * Verifies the JWT and attaches the user to req.user.
 * Returns 401 if the token is missing or invalid.
 */
export const authenticateJwt = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createHttpError(401, "Missing authorization header"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "secret";
    const payload: any = jwt.verify(token, secret);

    const user = await userService.getUserById(payload.sub);
    if (!user) {
      return next(createHttpError(401, "Invalid token"));
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, "Invalid token"));
  }
};

/**
 * RBAC middleware — restricts a route to one or more allowed roles.
 * Must be used after authenticateJwt.
 *
 * Usage:
 *   router.get("/dashboard", authenticateJwt, authorize("ADMIN"), getDashboard);
 *   router.post("/ratings", authenticateJwt, authorize("NORMAL_USER"), createRating);
 *   router.delete("/:id", authenticateJwt, authorize("ADMIN", "NORMAL_USER"), deleteRating);
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return next(createHttpError(403, "Access denied"));
    }
    next();
  };
};















