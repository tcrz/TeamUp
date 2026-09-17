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

export function getDateFromNow(durationString: string): Date {
  const now = new Date();
  const match = durationString.match(/^(\d+)([a-zA-Z]+)$/);
  
  if (!match) throw new Error(`Invalid duration: ${durationString}`);

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'm':  now.setMinutes(now.getMinutes() + value); break; // Minutes
    case 'h':  now.setHours(now.getHours() + value); break;     // Hours
    case 'd':  now.setDate(now.getDate() + value); break;       // Days
    case 'mo': now.setMonth(now.getMonth() + value); break;     // Months
    default:   throw new Error(`Unsupported unit: ${unit}`);
  }
  return now;
}