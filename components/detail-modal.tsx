"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrailerModal } from "./trailer-modal";
import { MediaType } from "./result-card";
import { useWatchlist } from "@/lib/watchlist-context";
import { TMDB_API_BASE, TMDB_IMAGE_BASE } from "@/lib/tmdb";

interface DetailModalProps {
  id: number | null;
  mediaType: MediaType | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface MovieCredit {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  character?: string;
  job?: string;
  vote_average?: number;
}

interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ id: number; name: string }>;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  status?: string;
  budget?: number;
  revenue?: number;
}

interface TVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  last_air_date?: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ id: number; name: string }>;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  status?: string;
  created_by?: Array<{ id: number; name: string }>;
}

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path?: string | null;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string;
  known_for_department?: string;
  movie_credits?: {
    cast: MovieCredit[];
    crew: MovieCredit[];
  };
  tv_credits?: {
    cast: MovieCredit[];
    crew: MovieCredit[];
  };
}

type Details = MovieDetails | TVDetails | PersonDetails;

export function DetailModal({ id, mediaType, isOpen, onClose }: DetailModalProps) {
  const [details, setDetails] = useState<Details | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (!id || !mediaType || !isOpen) {
      setDetails(null);
      setError(null);
      setTrailerKey(null);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/person/${id}?t=${Date.now()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load details");
        }

        setDetails(data);

        // Fetch trailer for movies and TV shows
        if (mediaType === "movie" || mediaType === "tv") {
          setIsLoadingTrailer(true);
          try {
            const videosRes = await fetch(`${TMDB_API_BASE}/${mediaType}/${id}/videos`);
            const videosData = await videosRes.json();
            if (videosData.results && videosData.results.length > 0) {
              setTrailerKey(videosData.results[0].key);
            }
          } catch {
            // Silently fail for trailers
          } finally {
            setIsLoadingTrailer(false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType, isOpen]);

  const isMovie = mediaType === "movie";
  const isTv = mediaType === "tv";
  const isPerson = mediaType === "person";

  const title = isMovie
    ? (details as MovieDetails)?.title
    : isTv
    ? (details as TVDetails)?.name
    : (details as PersonDetails)?.name;

  const imagePath = isPerson
    ? (details as PersonDetails)?.profile_path
    : (details as MovieDetails | TVDetails)?.poster_path;

  const imageUrl = imagePath ? `${TMDB_IMAGE_BASE}/w500${imagePath}` : null;

  const director =
    isMovie && (details as MovieDetails)?.credits?.crew
      ? (details as MovieDetails).credits!.crew.find((c) => c.job === "Director")?.name
      : isTv && (details as TVDetails)?.created_by?.length
      ? (details as TVDetails).created_by!.map((c) => c.name).join(", ")
      : null;

  const cast =
    !isPerson && (details as MovieDetails | TVDetails)?.credits?.cast
      ? (details as MovieDetails | TVDetails).credits!.cast.slice(0, 6)
      : [];

  const rating = !isPerson ? (details as MovieDetails | TVDetails)?.vote_average : null;

  const isBookmarked = id && (mediaType === "movie" || mediaType === "tv") 
    ? isInWatchlist(id, mediaType) 
    : false;

  const handleBookmarkToggle = () => {
    if (!id || !mediaType || mediaType === "person") return;

    if (isBookmarked) {
      removeFromWatchlist(id, mediaType);
    } else {
      addToWatchlist({
        id,
        media_type: mediaType,
        title: isMovie ? (details as MovieDetails)?.title : undefined,
        name: isTv ? (details as TVDetails)?.name : undefined,
        poster_path: (details as MovieDetails | TVDetails)?.poster_path,
        release_date: isMovie ? (details as MovieDetails)?.release_date : undefined,
        first_air_date: isTv ? (details as TVDetails)?.first_air_date : undefined,
        vote_average: (details as MovieDetails | TVDetails)?.vote_average,
      });
    }
  };

  // Get person's notable works
  const personWorks = isPerson
    ? [
        ...((details as PersonDetails)?.movie_credits?.cast || []),
        ...((details as PersonDetails)?.tv_credits?.cast || []),
      ]
        .filter((w) => w.vote_average && w.vote_average > 6)
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 8)
    : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-border bg-card/95 backdrop-blur-xl">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                  <div className="absolute inset-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
                <p className="text-sm text-muted-foreground">Loading details...</p>
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

          {details && !isLoading && !error && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-6 sm:flex-row">
                {/* Poster/Profile */}
                <div className="relative mx-auto w-48 flex-shrink-0 sm:mx-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${title} ${isPerson ? "profile" : "poster"}`}
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
                            d={
                              isPerson
                                ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                : "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                            }
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Rating Badge */}
                  {rating !== null && rating !== undefined && rating > 0 && (
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
                          {rating.toFixed(1)}
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
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {/* Media type badge */}
                      <span
                        className={`rounded border px-1.5 py-0.5 text-xs ${
                          isMovie
                            ? "border-primary/50 text-primary"
                            : isTv
                            ? "border-purple-400/50 text-purple-300"
                            : "border-amber-400/50 text-amber-300"
                        }`}
                      >
                        {isMovie ? "Movie" : isTv ? "TV Series" : "Person"}
                      </span>

                      {/* Movie/TV info */}
                      {isMovie && (details as MovieDetails).release_date && (
                        <>
                          <span className="text-border">|</span>
                          <span>
                            {new Date((details as MovieDetails).release_date!).getFullYear()}
                          </span>
                        </>
                      )}
                      {isTv && (details as TVDetails).first_air_date && (
                        <>
                          <span className="text-border">|</span>
                          <span>
                            {new Date((details as TVDetails).first_air_date!).getFullYear()}
                            {(details as TVDetails).status === "Ended" &&
                              (details as TVDetails).last_air_date &&
                              ` - ${new Date((details as TVDetails).last_air_date!).getFullYear()}`}
                          </span>
                        </>
                      )}
                      {isMovie && (details as MovieDetails).runtime && (
                        <>
                          <span className="text-border">|</span>
                          <span>{(details as MovieDetails).runtime} min</span>
                        </>
                      )}
                      {isTv && (details as TVDetails).number_of_seasons && (
                        <>
                          <span className="text-border">|</span>
                          <span>{(details as TVDetails).number_of_seasons} Season(s)</span>
                        </>
                      )}

                      {/* Person info */}
                      {isPerson && (details as PersonDetails).known_for_department && (
                        <>
                          <span className="text-border">|</span>
                          <span>{(details as PersonDetails).known_for_department}</span>
                        </>
                      )}
                      {isPerson && (details as PersonDetails).birthday && (
                        <>
                          <span className="text-border">|</span>
                          <span>
                            Born {new Date((details as PersonDetails).birthday!).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Genres */}
                    {!isPerson &&
                      (details as MovieDetails | TVDetails).genres &&
                      (details as MovieDetails | TVDetails).genres!.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(details as MovieDetails | TVDetails).genres!.map((genre) => (
                            <span
                              key={genre.id}
                              className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Plot/Biography */}
                  {((isMovie || isTv) &&
                    (details as MovieDetails | TVDetails).overview) ||
                  (isPerson && (details as PersonDetails).biography) ? (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {isPerson ? "Biography" : "Plot"}
                      </h3>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {isPerson
                          ? (details as PersonDetails).biography?.slice(0, 600) +
                            ((details as PersonDetails).biography?.length > 600 ? "..." : "")
                          : (details as MovieDetails | TVDetails).overview}
                      </p>
                    </div>
                  ) : null}

                  {/* Director/Creator */}
                  {director && (
                    <div>
                      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {isMovie ? "Director" : "Created By"}
                      </h3>
                      <p className="text-foreground">{director}</p>
                    </div>
                  )}

                  {/* Cast */}
                  {cast.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Cast
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cast.map((actor) => (
                          <span
                            key={actor.id}
                            className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground"
                          >
                            {actor.name}
                            {actor.character && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                as {actor.character}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Person's Notable Works */}
                  {isPerson && personWorks.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Notable Works
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {personWorks.map((work) => (
                          <div
                            key={`${work.id}-${work.character || work.job}`}
                            className="group/work relative overflow-hidden rounded-lg border border-border"
                          >
                            <div className="relative aspect-[2/3]">
                              {work.poster_path ? (
                                <Image
                                  src={`${TMDB_IMAGE_BASE}/w200${work.poster_path}`}
                                  alt={work.title || work.name || ""}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <svg
                                    className="h-6 w-6 text-muted-foreground"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover/work:opacity-100">
                              <p className="p-2 text-xs font-medium text-white line-clamp-2">
                                {work.title || work.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {/* Watch Trailer button */}
                    {trailerKey && !isPerson && (
                      <button
                        onClick={() => setIsTrailerOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Trailer
                      </button>
                    )}
                    
                    {isLoadingTrailer && !isPerson && (
                      <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading trailer...
                      </span>
                    )}

                    {/* Bookmark button */}
                    {!isPerson && (
                      <button
                        onClick={handleBookmarkToggle}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                          isBookmarked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
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
                        {isBookmarked ? "In Watchlist" : "Add to Watchlist"}
                      </button>
                    )}

                    {/* TMDB Link */}
                    <a
                      href={`https://www.themoviedb.org/${mediaType}/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                        <path d="M5 5v14h14v-7h-2v5H7V7h5V5H5z" />
                      </svg>
                      View on TMDB
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Trailer Modal */}
      <TrailerModal
        videoKey={trailerKey}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={title ? `${title} - Trailer` : "Trailer"}
      />
    </>
  );
}
