"use client";

import Image from "next/image";
import { TMDB_IMAGE_BASE } from "@/lib/tmdb";
import { TMDBResult, MediaType } from "./result-card";

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

interface FilmographySectionProps {
  personName: string;
  personImage?: string | null;
  personDepartment?: string;
  credits: CreditItem[];
  onItemClick: (item: TMDBResult) => void;
}

export function FilmographySection({
  personName,
  personImage,
  personDepartment,
  credits,
  onItemClick,
}: FilmographySectionProps) {
  const handleClick = (credit: CreditItem) => {
    const result: TMDBResult = {
      id: credit.id,
      media_type: credit.media_type as MediaType,
      title: credit.title,
      name: credit.name,
      poster_path: credit.poster_path,
      release_date: credit.release_date,
      first_air_date: credit.first_air_date,
      vote_average: credit.vote_average,
    };
    onItemClick(result);
  };

  const movieCredits = credits.filter((c) => c.media_type === "movie");
  const tvCredits = credits.filter((c) => c.media_type === "tv");

  return (
    <div className="space-y-8">
      {/* Person Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
        <div className="relative flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
          {/* Profile Image */}
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 border-primary/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            {personImage ? (
              <Image
                src={`${TMDB_IMAGE_BASE}/w300${personImage}`}
                alt={personName}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <svg
                  className="h-12 w-12 text-muted-foreground"
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
              </div>
            )}
          </div>

          {/* Person Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {personName}
            </h2>
            {personDepartment && (
              <p className="mt-1 text-muted-foreground">{personDepartment}</p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <span className="text-sm font-medium text-primary">
                  {movieCredits.length} Movies
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-1.5">
                <svg
                  className="h-4 w-4 text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-purple-300">
                  {tvCredits.length} TV Shows
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmography Grid */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            Full Filmography
          </h3>
          <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {credits.length} credits
          </span>
          <span className="text-xs text-muted-foreground">
            Sorted by popularity
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {credits.map((credit) => (
            <button
              key={`${credit.media_type}-${credit.id}`}
              onClick={() => handleClick(credit)}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 text-left transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                {credit.poster_path ? (
                  <Image
                    src={`${TMDB_IMAGE_BASE}/w342${credit.poster_path}`}
                    alt={credit.title || credit.name || "Poster"}
                    fill
                    className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <svg
                      className="h-10 w-10 text-muted-foreground"
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

                {/* Media type badge */}
                <div
                  className={`absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
                    credit.media_type === "movie"
                      ? "border border-primary/50 bg-primary/20 text-primary"
                      : "border border-purple-400/50 bg-purple-500/20 text-purple-300"
                  }`}
                >
                  {credit.media_type === "movie" ? "Movie" : "TV"}
                </div>

                {/* Rating badge */}
                {credit.vote_average !== undefined && credit.vote_average > 0 && (
                  <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded border border-yellow-500/30 bg-background/80 px-1.5 py-0.5 backdrop-blur-sm">
                    <svg
                      className="h-3 w-3 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-foreground">
                      {credit.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-lg border border-primary/50 bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
                    View Details
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-2.5">
                <h4 className="line-clamp-2 text-xs font-medium leading-tight text-foreground">
                  {credit.title || credit.name}
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  {(credit.release_date || credit.first_air_date) && (
                    <span className="text-[10px] text-muted-foreground">
                      {(credit.release_date || credit.first_air_date)?.split("-")[0]}
                    </span>
                  )}
                  {credit.character && (
                    <span className="line-clamp-1 text-[10px] text-muted-foreground">
                      as {credit.character}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
