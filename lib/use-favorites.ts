"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fs2s-favorites";
const EVENT_NAME = "fs2s-favorites-updated";

function readFavorites() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());

    sync();
    window.addEventListener(EVENT_NAME, sync);
    return () => window.removeEventListener(EVENT_NAME, sync);
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = (id: string) => {
    const next = favoriteSet.has(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFavorites(next);
    window.dispatchEvent(new Event(EVENT_NAME));
  };

  return {
    favorites,
    favoriteSet,
    toggleFavorite
  };
}
