"use client";

import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string, year?: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim(), year.trim() || undefined);
      }
    },
    [query, year, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      {/* Main Search Row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search Input */}
        <div className="relative group flex-1">
          {/* Glow effect background */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 blur-lg transition-all duration-500 group-focus-within:opacity-75 group-hover:opacity-50" />
          
          {/* Search input container */}
          <div className="relative flex items-center rounded-xl border border-border bg-card/80 backdrop-blur-xl transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-[0_0_25px_rgba(56,189,248,0.25)]">
            {/* Search icon */}
            <div className="flex items-center justify-center pl-4">
              <svg
                className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, actors..."
              className="flex-1 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Year Filter */}
        <div className="relative group">
          <div className="relative flex items-center rounded-xl border border-border bg-card/80 backdrop-blur-xl transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <div className="flex items-center justify-center pl-3">
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={year}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setYear(value);
              }}
              placeholder="Year"
              className="w-20 bg-transparent px-2 py-3.5 text-center text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
              maxLength={4}
            />
          </div>
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </>
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground">
        Search for movies, TV shows, or people (actors, directors)
        {year && ` • Filtering by year: ${year}`}
      </p>
    </form>
  );
}
