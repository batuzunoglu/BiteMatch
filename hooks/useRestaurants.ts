import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Restaurant {
    id: string;
    name: string;
    rating?: number;
    user_ratings_total?: number;
    address?: string;
    photo_reference?: string;
    price_level?: number;
}

const MOCK_RESTAURANTS: Restaurant[] = [
    {
        id: '1',
        name: 'Burger Haven',
        rating: 4.5,
        user_ratings_total: 120,
        address: '123 Burger St, Food City',
        price_level: 2,
    },
    {
        id: '2',
        name: 'Sushi Zen',
        rating: 4.8,
        user_ratings_total: 85,
        address: '456 Maki Ave, Kyoto Dist',
        price_level: 3,
    },
    {
        id: '3',
        name: 'Pizza Palace',
        rating: 4.2,
        user_ratings_total: 200,
        address: '789 Dough Rd, Little Italy',
        price_level: 1,
    },
];

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

import { useAppStore } from './useAppStore';

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const { swipedIds } = useAppStore();

    const fetchRestaurants = async (latitude?: number, longitude?: number, isNewSearch = false) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const isMockMode = process.env.EXPO_PUBLIC_API_MODE === 'MOCK';

            if (isMockMode) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Filter mock data too
                const filtered = MOCK_RESTAURANTS.filter(r => {
                    const ids = swipedIds instanceof Set ? swipedIds : new Set(swipedIds || []);
                    return !ids.has(r.id);
                });
                setRestaurants(filtered);
            } else {
                if (!latitude || !longitude) {
                    console.log("Discovery: Location missing in REAL mode, skipping fetch.");
                    setLoading(false);
                    return;
                }

                const searchParams: any = {
                    includedTypes: ['restaurant'],
                    maxResultCount: 20,
                    locationRestriction: {
                        circle: {
                            center: { latitude, longitude },
                            radius: 5000.0,
                        },
                    },
                };

                // Add pagination token if available and not a new search
                const currentToken = isNewSearch ? null : nextPageToken;

                const response = await axios.post(
                    'https://places.googleapis.com/v1/places:searchNearby',
                    searchParams,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                            'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.priceLevel,places.photos',
                        },
                    }
                );

                const newPlaces = response.data.places || [];
                setNextPageToken(response.data.nextPageToken || null);

                const mapped: Restaurant[] = newPlaces.map((p: any) => ({
                    id: p.id,
                    name: p.displayName.text,
                    rating: p.rating,
                    user_ratings_total: p.userRatingCount,
                    address: p.formattedAddress,
                    price_level: p.priceLevel,
                    photo_reference: p.photos?.[0]?.name,
                }));

                // Filter out swiped IDs
                const ids = swipedIds instanceof Set ? swipedIds : new Set(swipedIds || []);
                const filtered = mapped.filter(r => !ids.has(r.id));

                setRestaurants(prev => isNewSearch ? filtered : [...prev, ...filtered]);

                if (filtered.length < 5 && response.data.nextPageToken) {
                    // Note: We'd ideally wait a bit or handle this via a "Load More" trigger,
                    // but for "Discovery Continuity", we can try one more fetch.
                    console.log("Discovery Continuity: Fetching more results...");
                }
            }
        } catch (err: any) {
            setError('Failed to fetch restaurants');
            console.error('[API Error]', err.message);
            if (axios.isAxiosError(err)) {
                console.error('[API Error Data]', JSON.stringify(err.response?.data, null, 2));
                console.error('[API Request]', JSON.stringify(err.config?.data, null, 2));
            }
        } finally {
            setLoading(false);
        }
    };

    return { restaurants, loading, error, refetch: fetchRestaurants, nextPageToken };
};
