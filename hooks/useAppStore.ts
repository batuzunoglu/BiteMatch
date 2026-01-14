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
    swipedIds: Set<string>;
    pendingSync: { id: string, type: 'like' | 'dislike', restaurant?: Restaurant }[];
    hasCompletedOnboarding: boolean;
    addSwipe: (restaurant: Restaurant, type: 'like' | 'dislike') => void;
    removeLikedRestaurant: (id: string) => void;
    hydrateStore: (matches: Restaurant[], interactions: string[]) => void;
    clearStore: () => void;
    completeOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            likedRestaurants: [],
            swipedIds: new Set<string>(),
            pendingSync: [],
            hasCompletedOnboarding: false,
            addSwipe: (restaurant, type) =>
                set((state) => {
                    const newSwipedIds = new Set(state.swipedIds);
                    newSwipedIds.add(restaurant.id);

                    const isLike = type === 'like';
                    const alreadyLiked = state.likedRestaurants.some((r) => r.id === restaurant.id);

                    return {
                        swipedIds: newSwipedIds,
                        likedRestaurants: isLike && !alreadyLiked
                            ? [...state.likedRestaurants, restaurant]
                            : state.likedRestaurants,
                        pendingSync: [...state.pendingSync, { id: restaurant.id, type, restaurant: isLike ? restaurant : undefined }]
                    };
                }),
            removeLikedRestaurant: (id) =>
                set((state) => {
                    const newSwipedIds = new Set(state.swipedIds);
                    newSwipedIds.delete(id);
                    return {
                        likedRestaurants: state.likedRestaurants.filter((r) => r.id !== id),
                        swipedIds: newSwipedIds,
                        pendingSync: [...state.pendingSync, { id, type: 'dislike' }] // Using dislike as a placeholder for interaction removal logic
                    };
                }),
            hydrateStore: (matches, interactions) =>
                set({
                    likedRestaurants: matches,
                    swipedIds: new Set(interactions),
                    pendingSync: []
                }),
            clearStore: () => set({ likedRestaurants: [], swipedIds: new Set(), pendingSync: [] }),
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
        }),
        {
            name: 'bitematch-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                likedRestaurants: state.likedRestaurants,
                swipedIds: Array.from(state.swipedIds),
                hasCompletedOnboarding: state.hasCompletedOnboarding,
            }),
            merge: (persistedState: any, currentState) => {
                return {
                    ...currentState,
                    ...(persistedState as object),
                    swipedIds: new Set((persistedState as any)?.swipedIds || []),
                };
            },
        }
    )
);
