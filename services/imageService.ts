const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

/**
 * Constructs a signed Google Places photo URI.
 * @param photoId The photo reference from Google Places API.
 * @returns A URI string or a placeholder if photoId is missing.
 */
export const getRestaurantPhotoUri = (photoId: string | undefined): string => {
    if (!photoId) return getPlaceholderImage();

    // Pattern: https://places.googleapis.com/v1/{photoName}/media?key=${API_KEY}&maxWidthPx=800
    // Note: If the photoId is already the full path "places/.../photos/...", use it as is.
    // Otherwise, construct it. We assume the API returns the full path.
    const photoName = photoId.startsWith('places/') ? photoId : `places/unknown/photos/${photoId}`;

    return `https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_PLACES_API_KEY}&maxWidthPx=800`;
};

/**
 * Returns a local restaurant-themed placeholder asset.
 */
export const getPlaceholderImage = (): string => {
    // Using a high-quality placeholder image for restaurants
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop';
};
