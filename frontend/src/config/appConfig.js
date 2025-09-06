// Central app configuration with env-backed overrides
// Use Vite env vars (VITE_*) and provide safe defaults

function toInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export const appConfig = {
  // Minimum characters required before medicine search triggers
  minSearchLength: toInt(import.meta.env.VITE_MIN_SEARCH_LENGTH, 3),

  // Initial number of grouped results to show before "Show all"
  searchDisplayLimit: toInt(import.meta.env.VITE_SEARCH_DISPLAY_LIMIT, 5),
};
