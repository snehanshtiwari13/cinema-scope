"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist, WatchlistItem } from "@/lib/watchlist-context";
import { TMDB_IMAGE_BASE } from "@/lib/tmdb";
import { DetailModal } from "@/components/detail-modal";
import { MediaType } from "@/components/result-card";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<MediaType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = useCallback((item: WatchlistItem) => {
    setSelectedId(item.id);
    setSelectedType(item.media_type);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
    setSelectedType(null);
  }, []);

  const movieCount = watchlist.filter((w) => w.media_type === "movie").length;
  const tvCount = watchlist.filter((w) => w.media_type === "tv").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Search</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl">My Watchlist</h1>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {watchlist.length} item{watchlist.length !== 1 ? "s" : ""} saved
                  </p>
                </div>
              </div>
            </div>

            {watchlist.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {movieCount > 0 && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                      {movieCount} Movie{movieCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  {tvCount > 0 && (
                    <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300">
                      {tvCount} TV Show{tvCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearWatchlist}
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-white"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-sm">
                <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">Your Watchlist is Empty</h2>
            <p className="mb-8 max-w-md text-center text-muted-foreground">
              Start adding movies and TV shows to your watchlist by clicking the bookmark icon on any title.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {watchlist.map((item) => {
              const title = item.title || item.name || "Unknown";
              const imageUrl = item.poster_path
                ? `${TMDB_IMAGE_BASE}/w500${item.poster_path}`
                : null;
              const year = (item.release_date || item.first_air_date)?.split("-")[0];

              return (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]"
                >
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="w-full text-left"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`${title} poster`}
                          fill
                          className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                          </svg>
                        </div>
                      )}

                      {/* Media type badge */}
                      <div
                        className={`absolute left-2 top-2 rounded-md border px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm sm:px-2 sm:py-1 sm:text-xs ${
                          item.media_type === "movie"
                            ? "border-primary/50 bg-primary/20 text-primary"
                            : "border-purple-400/50 bg-purple-500/20 text-purple-300"
                        }`}
                      >
                        {item.media_type === "movie" ? "Movie" : "TV"}
                      </div>

                      {/* Rating badge */}
                      {item.vote_average !== undefined && item.vote_average > 0 && (
                        <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md border border-yellow-500/30 bg-background/80 px-1.5 py-0.5 backdrop-blur-sm">
                          <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-[10px] font-semibold text-foreground">{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
                        {title}
                      </h3>
                      {year && <p className="mt-1 text-xs text-muted-foreground">{year}</p>}
                    </div>
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(item.id, item.media_type);
                    }}
                    className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/80 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-destructive group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        id={selectedId}
        mediaType={selectedType}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
