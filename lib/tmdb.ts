/** Same-origin prefix for TMDB JSON — implemented by `app/api/tmdb/*` Route Handlers. */
export const TMDB_API_BASE = "/api/tmdb";

/** Same-origin prefix for posters — proxied via `vercel.json` to `image.tmdb.org`. */
export const TMDB_IMAGE_BASE = "/api/images";

/**
 * Direct TMDB v3 API base for server-side `fetch` in Route Handlers (Bearer token).
 * Do not set this to `/api/tmdb`: handlers would call themselves recursively.
 */
export const TMDB_UPSTREAM_API_BASE = "https://api.themoviedb.org/3";
