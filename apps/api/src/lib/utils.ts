import { HttpError } from "./httpError";

/**
 * Express 5 types a route param as `string | string[]` (a pattern can match
 * repeatedly). Anything that isn't a single string is invalid input, so it is
 * rejected here rather than cast away at every call site.
 *
 * Note `Number(["7"])` is 7 — arrays coerce via toString — so the array case
 * must be excluded explicitly, not left to Number().
 */
export const parseId = (id: string | string[] | undefined): number => {
  if (typeof id !== "string") {
    throw new HttpError(400, `Invalid ID: "${String(id)}"`);
  }
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(400, `Invalid ID: "${id}"`);
  }
  return parsedId;
};
