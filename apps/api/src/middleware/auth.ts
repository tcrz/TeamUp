import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";
import { HttpError } from "../lib/httpError";

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload as TokenPayload;
    next();
  } catch (error) {
    // A failed auth is an expected outcome, not a server fault - no stack trace.
    return next(new HttpError(401, "Unauthorized"));
  }
}
