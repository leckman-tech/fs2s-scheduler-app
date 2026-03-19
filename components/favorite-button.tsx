"use client";

import { useFavorites } from "@/lib/use-favorites";

export function FavoriteButton({ sessionId }: { sessionId: string }) {
  const { favoriteSet, toggleFavorite } = useFavorites();
  const isFavorite = favoriteSet.has(sessionId);

  return (
    <button
      type="button"
      className={isFavorite ? "button" : "button-secondary"}
      onClick={() => toggleFavorite(sessionId)}
      aria-pressed={isFavorite}
    >
      {isFavorite ? "Saved to My Agenda" : "Save to My Agenda"}
    </button>
  );
}
