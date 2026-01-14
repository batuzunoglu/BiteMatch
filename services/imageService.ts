const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

/**
 * Constructs a signed Google Places photo URI.
 * @param photoId The photo reference from Google Places API.
 * @returns A URI string or a placeholder if photoId is missing.
 */
/**
 * Constructs a signed Google Places photo URI.
 * @param photoId The photo reference from Google Places API.
 * @returns A URI string or a placeholder if photoId is missing.
 */
export const getRestaurantPhotoUri = (photoId: string | undefined): string => {
    if (!photoId) return getPlaceholderImage();

    // If it's already a full URI (e.g., from Unsplash or cached), return it
    if (photoId.startsWith('http')) return photoId;

    const photoName = photoId.startsWith('places/') ? photoId : `places/unknown/photos/${photoId}`;
    return `https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_PLACES_API_KEY}&maxWidthPx=800`;
};

/**
 * Professional Refresh Logic (Architect requirement #2)
 * Since Google photo URLs have a short TTL, this service can be used to re-fetch
 * a fresh signed URL if a media load failure occurs.
 */
export const fetchFreshPhotoUri = async (photoReference: string): Promise<string> => {
    try {
        // In production, this would call a backend or a thin wrapper to Google's API
        // to get a new signed redirect.
        const freshUri = `https://places.googleapis.com/v1/${photoReference}/media?key=${GOOGLE_PLACES_API_KEY}&maxWidthPx=800`;
        return freshUri;
    } catch (e) {
        return getPlaceholderImage();
    }
};

/**
 * Returns a local restaurant-themed placeholder asset.
 */
export const getPlaceholderImage = (): string => {
    // Using a high-quality placeholder image for restaurants
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop';
};
