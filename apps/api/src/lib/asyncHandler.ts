import { NextFunction, Request, Response } from "express";

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Request, res as Response, next)).catch(next);
    };
};