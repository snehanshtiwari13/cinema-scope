"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TMDBResult, MediaType } from "./result-card";
import { useWatchlist } from "@/lib/watchlist-context";
import { TMDB_API_BASE, TMDB_IMAGE_BASE } from "@/lib/tmdb";

interface TrendingSectionProps {
  onItemClick: (item: TMDBResult) => void;
}

interface TrendingItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
}

export function TrendingSection({ onItemClick }: TrendingSectionProps) {
  const [trendingMovies, setTrendingMovies] = useState<TrendingItem[]>([]);
  const [trendingTV, setTrendingTV] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`${TMDB_API_BASE}/trending?type=movie&time_window=week`),
          fetch(`${TMDB_API_BASE}/trending?type=tv&time_window=week`),
        ]);

        const moviesData = await moviesRes.json();
        const tvData = await tvRes.json();

        if (moviesData.results) {
          setTrendingMovies(moviesData.results.slice(0, 10));
        }
        if (tvData.results) {
          setTrendingTV(tvData.results.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to fetch trending:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleClick = (item: TrendingItem) => {
    const result: TMDBResult = {
      id: item.id,
      media_type: item.media_type as MediaType,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      vote_average: item.vote_average,
    };
    onItemClick(result);
  };

  const handleBookmark = (e: React.MouseEvent, item: TrendingItem) => {
    e.stopPropagation();
    if (isInWatchlist(item.id, item.media_type)) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist({
        id: item.id,
        media_type: item.media_type,
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-10">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="flex gap-4 overflow-hidden">
              {[0, 1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="aspect-[2/3] w-36 flex-shrink-0 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderSection = (title: string, items: TrendingItem[], icon: React.ReactNode) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          {items.map((item) => {
            const isBookmarked = isInWatchlist(item.id, item.media_type);
            return (
              <button
                key={`${item.media_type}-${item.id}`}
                onClick={() => handleClick(item)}
                className="group relative w-36 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card/50 text-left transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] sm:w-40"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  {item.poster_path ? (
                    <Image
                      src={`${TMDB_IMAGE_BASE}/w342${item.poster_path}`}
                      alt={item.title || item.name || "Poster"}
                      fill
                      className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                      sizes="160px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                      </svg>
                    </div>
                  )}

                  {/* Rating badge */}
                  {item.vote_average !== undefined && item.vote_average > 0 && (
                    <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md border border-yellow-500/30 bg-background/80 px-1.5 py-0.5 backdrop-blur-sm">
                      <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-foreground">{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Bookmark button */}
                  <button
                    onClick={(e) => handleBookmark(e, item)}
                    className={`absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
                      isBookmarked
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/60 text-foreground hover:bg-primary/80 hover:text-primary-foreground"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill={isBookmarked ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
                    {item.title || item.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {(item.release_date || item.first_air_date)?.split("-")[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {renderSection(
        "Trending Movies",
        trendingMovies,
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )}

      {renderSection(
        "Trending TV Shows",
        trendingTV,
        <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
}
