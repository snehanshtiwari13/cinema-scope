"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
}

interface MovieDetailModalProps {
  imdbID: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailModal({ imdbID, isOpen, onClose }: MovieDetailModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imdbID || !isOpen) {
      setMovieDetails(null);
      setError(null);
      return;
    }

    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=4089027d&plot=full`
        );
        const data = await response.json();

        if (data.Response === "True") {
          setMovieDetails(data);
        } else {
          setError(data.Error || "Failed to load movie details");
        }
      } catch {
        setError("Failed to fetch movie details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID, isOpen]);

  const hasPoster = movieDetails?.Poster && movieDetails.Poster !== "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-border bg-card/95 backdrop-blur-xl">
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                <div className="absolute inset-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <p className="text-sm text-muted-foreground">Loading movie details...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
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
            <p className="text-center text-muted-foreground">{error}</p>
          </div>
        )}

        {movieDetails && !isLoading && !error && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{movieDetails.Title}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Poster */}
              <div className="relative mx-auto w-48 flex-shrink-0 sm:mx-0">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border">
                  {hasPoster ? (
                    <Image
                      src={movieDetails.Poster}
                      alt={`${movieDetails.Title} poster`}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <svg
                        className="h-16 w-16 text-muted-foreground"
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
                  )}
                </div>

                {/* IMDb Rating Badge */}
                {movieDetails.imdbRating && movieDetails.imdbRating !== "N/A" && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/50 bg-background/90 px-4 py-1.5 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-semibold text-foreground">
                        {movieDetails.imdbRating}
                      </span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                {/* Title and basic info */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {movieDetails.Title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{movieDetails.Year}</span>
                    {movieDetails.Rated && movieDetails.Rated !== "N/A" && (
                      <>
                        <span className="text-border">|</span>
                        <span className="rounded border border-border px-1.5 py-0.5 text-xs">
                          {movieDetails.Rated}
                        </span>
                      </>
                    )}
                    {movieDetails.Runtime && movieDetails.Runtime !== "N/A" && (
                      <>
                        <span className="text-border">|</span>
                        <span>{movieDetails.Runtime}</span>
                      </>
                    )}
                  </div>
                  {movieDetails.Genre && movieDetails.Genre !== "N/A" && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {movieDetails.Genre.split(", ").map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Plot */}
                {movieDetails.Plot && movieDetails.Plot !== "N/A" && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Plot
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {movieDetails.Plot}
                    </p>
                  </div>
                )}

                {/* Director */}
                {movieDetails.Director && movieDetails.Director !== "N/A" && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Director
                    </h3>
                    <p className="text-foreground">{movieDetails.Director}</p>
                  </div>
                )}

                {/* Cast */}
                {movieDetails.Actors && movieDetails.Actors !== "N/A" && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Cast
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.Actors.split(", ").map((actor) => (
                        <span
                          key={actor}
                          className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Ratings */}
                {movieDetails.Ratings && movieDetails.Ratings.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Ratings
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {movieDetails.Ratings.map((rating) => (
                        <div
                          key={rating.Source}
                          className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center"
                        >
                          <p className="text-xs text-muted-foreground">
                            {rating.Source === "Internet Movie Database"
                              ? "IMDb"
                              : rating.Source === "Rotten Tomatoes"
                              ? "Rotten Tomatoes"
                              : rating.Source}
                          </p>
                          <p className="mt-0.5 font-semibold text-foreground">
                            {rating.Value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {movieDetails.Awards && movieDetails.Awards !== "N/A" && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1-3-7z" />
                      </svg>
                      <p className="text-sm text-foreground/90">{movieDetails.Awards}</p>
                    </div>
                  </div>
                )}

                {/* IMDB Link */}
                <a
                  href={`https://www.imdb.com/title/${movieDetails.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    <path d="M5 5v14h14v-7h-2v5H7V7h5V5H5z" />
                  </svg>
                  View on IMDb
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
