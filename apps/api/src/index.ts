import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AuthMiddleware } from "./middleware/auth";

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});