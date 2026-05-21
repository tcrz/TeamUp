import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = (req.headers as any).authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error();
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload as TokenPayload;
    next();
  } catch (error) {
    console.error("Error in AuthMiddleware:", error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
