"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface WatchlistItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  addedAt: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeFromWatchlist: (id: number, mediaType: "movie" | "tv") => void;
  isInWatchlist: (id: number, mediaType: "movie" | "tv") => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = "cinemascope-watchlist";

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error("Failed to save watchlist:", error);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, "addedAt">) => {
    setWatchlist((prev) => {
      // Check if already exists
      const exists = prev.some(
        (w) => w.id === item.id && w.media_type === item.media_type
      );
      if (exists) return prev;
      
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number, mediaType: "movie" | "tv") => {
    setWatchlist((prev) =>
      prev.filter((w) => !(w.id === id && w.media_type === mediaType))
    );
  }, []);

  const isInWatchlist = useCallback(
    (id: number, mediaType: "movie" | "tv") => {
      return watchlist.some((w) => w.id === id && w.media_type === mediaType);
    },
    [watchlist]
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
