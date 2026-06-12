import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AuthMiddleware } from "./middleware/auth";
import projectsRouter from "./routes/projects";

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.get('/api/me', AuthMiddleware, (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});
app.use('/api/projects', AuthMiddleware, projectsRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});