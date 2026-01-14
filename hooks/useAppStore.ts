import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Restaurant {
    id: string;
    name: string;
    rating?: number;
    user_ratings_total?: number;
    address?: string;
    photo_reference?: string;
    price_level?: number;
}

interface AppState {
    likedRestaurants: Restaurant[];
    addLikedRestaurant: (restaurant: Restaurant) => void;
    removeLikedRestaurant: (id: string) => void;
    clearLikes: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            likedRestaurants: [],
            addLikedRestaurant: (restaurant) =>
                set((state) => ({
                    likedRestaurants: state.likedRestaurants.some((r) => r.id === restaurant.id)
                        ? state.likedRestaurants
                        : [...state.likedRestaurants, restaurant],
                })),
            removeLikedRestaurant: (id) =>
                set((state) => ({
                    likedRestaurants: state.likedRestaurants.filter((r) => r.id !== id),
                })),
            clearLikes: () => set({ likedRestaurants: [] }),
        }),
        {
            name: 'bitematch-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
