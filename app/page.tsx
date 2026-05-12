"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { ResultCard, TMDBResult, MediaType } from "@/components/result-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { WelcomeState } from "@/components/welcome-state";
import { DetailModal } from "@/components/detail-modal";
import { FilmographySection } from "@/components/filmography-section";
import { TMDB_API_BASE } from "@/lib/tmdb";

interface TMDBSearchResponse {
  page: number;
  results: TMDBResult[];
  total_pages: number;
  total_results: number;
  error?: string;
}

interface CreditItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
  character?: string;
  job?: string;
}

interface PersonCreditsResponse {
  id: number;
  credits: CreditItem[];
  total: number;
  error?: string;
}

interface PersonResult {
  id: number;
  name: string;
  profile_path?: string | null;
  known_for_department?: string;
}

export default function CinemaScope() {
  const [results, setResults] = useState<TMDBResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<MediaType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Person filmography state
  const [personResult, setPersonResult] = useState<PersonResult | null>(null);
  const [personCredits, setPersonCredits] = useState<CreditItem[]>([]);
  const [isPersonSearch, setIsPersonSearch] = useState(false);

  const searchContent = useCallback(async (query: string, year?: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchQuery(query);
    setIsPersonSearch(false);
    setPersonResult(null);
    setPersonCredits([]);

    try {
      const params = new URLSearchParams({ query });
      if (year) {
        params.set("year", year);
      }

      const response = await fetch(`/api/tmdb/search?${params.toString()}`);
      const data: TMDBSearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search");
      }

      if (data.results && data.results.length > 0) {
        // Filter to only include movie, tv, and person results
        const filteredResults = data.results.filter(
          (r) => r.media_type === "movie" || r.media_type === "tv" || r.media_type === "person"
        );

        // Check if the top result is a person
        const topResult = filteredResults[0];
        if (topResult && topResult.media_type === "person") {
          // Multi-step search: fetch person's credits
          setIsPersonSearch(true);
          setPersonResult({
            id: topResult.id,
            name: topResult.name || "Unknown",
            profile_path: topResult.profile_path,
            known_for_department: topResult.known_for_department,
          });

          // Fetch the person's combined credits
          const creditsResponse = await fetch(
            `/api/tmdb/person/${topResult.id}/credits?t=${Date.now()}`
          );
          const creditsData: PersonCreditsResponse = await creditsResponse.json();

          if (creditsResponse.ok && creditsData.credits) {
            setPersonCredits(creditsData.credits);
            // Also show remaining search results (other people, movies, TV shows)
            setResults(filteredResults.slice(1));
          } else {
            throw new Error(creditsData.error || "Failed to fetch filmography");
          }
        } else {
          // Regular search results
          setResults(filteredResults);
          if (filteredResults.length === 0) {
            setError("No movies, TV shows, or people found");
          }
        }
      } else {
        setResults([]);
        setError("No results found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch. Please try again.");
      setResults([]);
      setPersonCredits([]);
      setPersonResult(null);
      setIsPersonSearch(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewDetails = useCallback((result: TMDBResult) => {
    setSelectedId(result.id);
    setSelectedType(result.media_type);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
    setSelectedType(null);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    searchContent(suggestion);
  }, [searchContent]);

  // Keyboard shortcut for focusing search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="text"]'
        );
        searchInput?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Count results by type
  const movieCount = results.filter((r) => r.media_type === "movie").length;
  const tvCount = results.filter((r) => r.media_type === "tv").length;
  const personCount = results.filter((r) => r.media_type === "person").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Cinema<span className="text-primary">Scope</span>
            </h1>
          </div>

          {/* Search bar */}
          <SearchBar onSearch={searchContent} isLoading={isLoading} />

          {/* Keyboard shortcut hint */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              ⌘K
            </kbd>{" "}
            to focus search
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading state */}
        {isLoading && <LoadingSpinner />}

        {/* Error state */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
              <svg
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              No Results Found
            </h3>
            <p className="text-center text-muted-foreground">
              {error}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching with a different term
            </p>
          </div>
        )}

        {/* Person Filmography View */}
        {!isLoading && !error && isPersonSearch && personResult && (
          <div className="space-y-10">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Results for:{" "}
                <span className="text-primary">&quot;{searchQuery}&quot;</span>
              </h2>
            </div>

            <FilmographySection
              personName={personResult.name}
              personImage={personResult.profile_path}
              personDepartment={personResult.known_for_department}
              credits={personCredits}
              onItemClick={handleViewDetails}
            />

            {/* Other search results if any */}
            {results.length > 0 && (
              <div className="pt-6 border-t border-border">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Other Results
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {movieCount > 0 && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {movieCount} Movie{movieCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {tvCount > 0 && (
                      <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                        {tvCount} TV Show{tvCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {personCount > 0 && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
                        {personCount} {personCount !== 1 ? "People" : "Person"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {results.map((result) => (
                    <ResultCard
                      key={`${result.media_type}-${result.id}`}
                      result={result}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regular Results View */}
        {!isLoading && !error && !isPersonSearch && results.length > 0 && (
          <div>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Results for:{" "}
                <span className="text-primary">&quot;{searchQuery}&quot;</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {movieCount > 0 && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {movieCount} Movie{movieCount !== 1 ? "s" : ""}
                  </span>
                )}
                {tvCount > 0 && (
                  <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                    {tvCount} TV Show{tvCount !== 1 ? "s" : ""}
                  </span>
                )}
                {personCount > 0 && (
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
                    {personCount} {personCount !== 1 ? "People" : "Person"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((result) => (
                <ResultCard
                  key={`${result.media_type}-${result.id}`}
                  result={result}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Welcome state */}
        {!isLoading && !hasSearched && (
          <WelcomeState onSuggestionClick={handleSuggestionClick} />
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        id={selectedId}
        mediaType={selectedType}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                TMDB
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
