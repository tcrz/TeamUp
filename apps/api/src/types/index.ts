import type { JwtPayload } from "jsonwebtoken";

export type TokenPayload = JwtPayload & { userId: number; email: string };
