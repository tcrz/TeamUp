import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import jwt, { decode } from "jsonwebtoken";
import { HttpError } from "../lib/httpError";
import { buildResponse } from "../lib/response";
import { asyncHandler } from "../lib/asyncHandler";
import {
  issueAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
} from "../services/auth";
import crypto from "crypto";

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
  }),
);

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
    const accessToken = issueAccessToken(user);
    const refreshToken = issueRefreshToken(user);
    const payload = jwt.decode(refreshToken);
    if (!payload || typeof payload === "string" || payload.exp === undefined) {
      throw new Error("Refresh token was signed without an exp claim");
    }
    await prisma.refreshToken.create({
      data: {
        tokenHash: crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex"), // Store hashed refresh token for security
        userId: user.id,
        expiresAt: new Date(payload.exp * 1000), // Convert exp from seconds to milliseconds
      },
    });
    res.status(200).json(
      buildResponse("User logged in successfully", {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      }),
    );
  }),
);

router.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new HttpError(401, "Unauthorized");
    }
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!storedToken) {
      throw new HttpError(401, "Unauthorized");
    }
    const token = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: (token as jwt.JwtPayload).id },
    });
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }
    const newAccessToken = issueAccessToken(user);
    const newRefreshToken = issueRefreshToken(user);
    const hashedNewRefreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // revoke old token and store new refresh token
    await prisma.$transaction(async (tx) => {
      const payload = jwt.decode(newRefreshToken);
      if (
        !payload ||
        typeof payload === "string" ||
        payload.exp === undefined
      ) {
        throw new Error("Refresh token was signed without an exp claim");
      }
      const { count } = await tx.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
        data: {
          revokedAt: new Date(),
        },
      });
      if (count !== 1) {
        throw new HttpError(401, "Unauthorized");
      }
      await tx.refreshToken.create({
        data: {
          tokenHash: hashedNewRefreshToken,
          userId: user.id,
          expiresAt: new Date(payload.exp * 1000), // Convert exp from seconds to milliseconds
        },
      });
    });
    res.status(200).json(
      buildResponse("Token refreshed successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
    );
  }),
);

router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    // Invalidate the refresh token on the client side by removing it from storage
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(200).json(buildResponse("User logged out successfully"));
      return;
    }
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await prisma.refreshToken.updateMany({
      where: { tokenHash: refreshTokenHash },
      data: {
        revokedAt: new Date(),
      },
    });
    res.status(200).json(buildResponse("User logged out successfully"));
  }),
);

export default router;
