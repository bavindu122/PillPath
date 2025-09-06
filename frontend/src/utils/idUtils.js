// Utility to parse route or mixed ID values for API usage
// - If the value is a numeric string (e.g., "42"), return Number(value)
// - If it's already a number, return as-is
// - Otherwise, return the original value (string or other) so callers can decide
export function parseIdForApi(value) {
  if (value == null) return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const str = String(value).trim();
  if (/^\d+$/.test(str)) return Number(str);
  return value;
}
