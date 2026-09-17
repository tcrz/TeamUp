import { User } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { HttpError } from "../lib/httpError";

const issueAccessToken = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      jti: crypto.randomUUID(), // Unique identifier for the token
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env
        .JWT_ACCESS_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"],
    },
  );

  return token;
};

const issueRefreshToken = (user: User) => {
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      jti: crypto.randomUUID(), // Unique identifier for the token
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env
        .JWT_REFRESH_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"],
    },
  );

  return refreshToken;
};

const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    return decoded;
  } catch (err) {
    throw new HttpError(401, "Unauthorized");
  }
};

export { issueAccessToken, issueRefreshToken, verifyRefreshToken };
