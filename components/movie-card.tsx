"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieCardProps {
  movie: Movie;
  onViewDetails?: (movie: Movie) => void;
}

export function MovieCard({ movie, onViewDetails }: MovieCardProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {hasPoster ? (
          <Image
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        
        {/* Year badge */}
        <div className="absolute left-3 top-3 rounded-md border border-border/50 bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {movie.Year}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-tight text-foreground">
          {movie.Title}
        </h3>
        
        <Button
          onClick={() => onViewDetails?.(movie)}
          className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-all duration-200"
          size="sm"
        >
          <svg
            className="mr-2 h-4 w-4"
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
          View Details
        </Button>
      </div>
    </div>
  );
}
