# Rule: Image & Media Helper Service

## 1. Google Places Photo URI Construction
- **Service Location:** `src/services/imageService.ts`
- **Logic:** The helper must take a `photoName` (format: `places/{placeId}/photos/{photoId}`) and return a signed URI.
- **Pattern:** `https://places.googleapis.com/v1/{photoName}/media?key=${API_KEY}&maxWidthPx=800`
- **Required Handling:** - Always include a `maxWidthPx` or `maxHeightPx` to optimize bandwidth.
    - Implement a `getPlaceholderImage()` function that returns a local restaurant-themed asset if the API fails or no photo is available.

## 2. Caching Strategy
- **Library:** Use `expo-image` for high-performance disk and memory caching.
- **Rule:** All restaurant thumbnails in the Swipe Card must use the `priority="high"` and `cachePolicy="disk"` settings to ensure instant loading during swiping.