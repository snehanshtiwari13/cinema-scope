"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/lib/watchlist-context";
import { TMDB_IMAGE_BASE } from "@/lib/tmdb";

export type MediaType = "movie" | "tv" | "person";

export interface TMDBResult {
  id: number;
  media_type: MediaType;
  // Movie/TV fields
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  // Person fields
  known_for_department?: string;
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
  }>;
}

interface ResultCardProps {
  result: TMDBResult;
  onViewDetails: (result: TMDBResult) => void;
}

export function ResultCard({ result, onViewDetails }: ResultCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const isMovie = result.media_type === "movie";
  const isTv = result.media_type === "tv";
  const isPerson = result.media_type === "person";

  const title = result.title || result.name || "Unknown";
  const imagePath = isPerson ? result.profile_path : result.poster_path;
  const imageUrl = imagePath
    ? `${TMDB_IMAGE_BASE}/w500${imagePath}`
    : null;

  const year = isMovie
    ? result.release_date?.split("-")[0]
    : isTv
    ? result.first_air_date?.split("-")[0]
    : null;

  const rating = result.vote_average;
  
  const isBookmarked = !isPerson && isInWatchlist(result.id, result.media_type as "movie" | "tv");

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPerson) return;

    if (isBookmarked) {
      removeFromWatchlist(result.id, result.media_type as "movie" | "tv");
    } else {
      addToWatchlist({
        id: result.id,
        media_type: result.media_type as "movie" | "tv",
        title: result.title,
        name: result.name,
        poster_path: result.poster_path,
        release_date: result.release_date,
        first_air_date: result.first_air_date,
        vote_average: result.vote_average,
      });
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]">
      {/* Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} ${isPerson ? "profile" : "poster"}`}
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            {isPerson ? (
              <svg
                className="h-12 w-12 text-muted-foreground sm:h-16 sm:w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ) : (
              <svg
                className="h-12 w-12 text-muted-foreground sm:h-16 sm:w-16"
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
            )}
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-1.5 top-1.5 flex flex-col gap-1 sm:left-2 sm:top-2 sm:gap-1.5">
          {/* Media type badge */}
          <div
            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm sm:px-2 sm:py-1 sm:text-xs ${
              isMovie
                ? "border-primary/50 bg-primary/20 text-primary"
                : isTv
                ? "border-purple-400/50 bg-purple-500/20 text-purple-300"
                : "border-amber-400/50 bg-amber-500/20 text-amber-300"
            }`}
          >
            {isMovie ? "Movie" : isTv ? "TV" : "Person"}
          </div>
          
          {/* Year badge */}
          {year && (
            <div className="rounded-md border border-border/50 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm sm:px-2 sm:py-1 sm:text-xs">
              {year}
            </div>
          )}
        </div>

        {/* Rating badge */}
        {rating !== undefined && rating > 0 && !isPerson && (
          <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-md border border-yellow-500/30 bg-background/80 px-1.5 py-0.5 backdrop-blur-sm sm:right-2 sm:top-2 sm:gap-1 sm:px-2 sm:py-1">
            <svg
              className="h-3 w-3 text-yellow-500 sm:h-3.5 sm:w-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[10px] font-semibold text-foreground sm:text-xs">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Bookmark button */}
        {!isPerson && (
          <button
            onClick={handleBookmark}
            className={`absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all sm:bottom-2 sm:right-2 sm:h-9 sm:w-9 ${
              isBookmarked
                ? "bg-primary text-primary-foreground"
                : "bg-background/60 text-foreground opacity-0 group-hover:opacity-100 hover:bg-primary/80 hover:text-primary-foreground"
            }`}
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill={isBookmarked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground sm:text-base">
          {title}
        </h3>

        {/* Person known for */}
        {isPerson && result.known_for_department && (
          <p className="mb-2 text-[10px] text-muted-foreground sm:text-xs">
            {result.known_for_department}
          </p>
        )}

        {/* Known for titles */}
        {isPerson && result.known_for && result.known_for.length > 0 && (
          <p className="mb-2 line-clamp-2 text-[10px] text-muted-foreground sm:mb-3 sm:text-xs">
            Known for:{" "}
            {result.known_for
              .slice(0, 2)
              .map((item) => item.title || item.name)
              .join(", ")}
          </p>
        )}

        <Button
          onClick={() => onViewDetails(result)}
          className="mt-1 w-full border border-primary/30 bg-primary/10 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground sm:mt-2"
          size="sm"
        >
          <svg
            className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-xs sm:text-sm">View Details</span>
        </Button>
      </div>
    </div>
  );
}
