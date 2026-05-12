"use client";

const trendingMovies = [
  { title: "Inception", year: "2010" },
  { title: "The Dark Knight", year: "2008" },
  { title: "Interstellar", year: "2014" },
  { title: "Pulp Fiction", year: "1994" },
  { title: "The Matrix", year: "1999" },
  { title: "Forrest Gump", year: "1994" },
];

interface WelcomeStateProps {
  onSuggestionClick: (query: string) => void;
}

export function WelcomeState({ onSuggestionClick }: WelcomeStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Hero icon */}
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-sm">
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
        </div>
      </div>

      {/* Welcome text */}
      <h2 className="mb-3 text-center text-2xl font-bold text-foreground sm:text-3xl">
        <span className="text-balance">Discover Your Next Favorite Movie</span>
      </h2>
      <p className="mb-10 max-w-md text-center text-muted-foreground text-pretty">
        Search millions of movies, TV shows, and people from TMDB. Find your favorite actors, discover new releases, and explore cinema from around the world.
      </p>

      {/* Trending section */}
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-sm font-medium text-foreground">
            Trending Searches
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {trendingMovies.map((movie) => (
            <button
              key={movie.title}
              onClick={() => onSuggestionClick(movie.title)}
              className="group flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)]"
            >
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {movie.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {movie.year}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            ),
            title: "Quick Search",
            description: "Find any movie in seconds",
          },
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            ),
            title: "Rich Details",
            description: "Explore posters, years, and more",
          },
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ),
            title: "Real-time Results",
            description: "Instant search with live updates",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center rounded-xl border border-border bg-card/30 p-6 text-center backdrop-blur-sm"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
