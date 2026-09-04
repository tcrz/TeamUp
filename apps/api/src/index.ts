import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AuthMiddleware } from "./middleware/auth";
import projectsRouter from "./routes/projects";
import tasksRouter from "./routes/tasks";
import { HttpError } from "./lib/httpError";
import { buildResponse } from "./lib/response";

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json(buildResponse("OK"));
});
app.use('/api/auth', authRoutes);
app.get('/api/me', AuthMiddleware, (req: Request, res: Response) => {
  res.status(200).json(buildResponse("User retrieved successfully", req.user));
});
app.use('/api/projects', AuthMiddleware, projectsRouter);
app.use('/api/projects', AuthMiddleware, tasksRouter);
app.use((req: Request, res: Response) => {
  throw new HttpError(404, "Route not found");
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError && err.status < 500) {
    return res.status(err.status).json(buildResponse(err.message));
  }
  // 5xx only: an unexpected failure is a bug and deserves a stack trace.
  console.error(err.stack);
  const status = err instanceof HttpError ? err.status : 500;
  return res.status(status).json(buildResponse("Internal server error"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});