import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import { HttpError } from "../lib/httpError";
import { buildResponse } from "../lib/response";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw new HttpError(400, "Name, email, and password are required");
      }
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        throw new HttpError(409, "User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json(
        buildResponse("User registered successfully", {
          id: user.id,
          name: user.name,
          email: user.email,
        }),
      );
  }));

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new HttpError(401, "Invalid credentials");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env
          .JWT_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"],
      },
    );
    res.status(200).json(
      buildResponse("User logged in successfully", {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      }),
    );
  }),
);

export default router;
