import { create } from "zustand";

interface FavoritesStore {
  favorites: Set<string>;
  toggleFavorite: (productId: string) => void;
}

export const useFavorites = create<FavoritesStore>((set) => ({
  favorites: new Set<string>(),
  toggleFavorite: (productId) =>
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return { favorites: newFavorites };
    }),
})); 