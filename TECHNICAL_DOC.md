# BiteMatch: System Architecture & Technical Documentation

**Version:** 1.0.0  
**Status:** Professional Development Phase  
**Author:** Antigravity (Senior Technical Architect)

---

## 1. System Overview
BiteMatch is a high-performance discovery platform designed for the "Tinder-style" restaurant matching experience. The architecture prioritizes fluid animations, optimistic UI updates, and real-time data synchronization.

### Core 'Swipe-to-Match' Flow
1. **Bootstrap**: Application requests location permissions via `expo-location`.
2. **Ingestion**: Fetches the nearest 20 restaurants using the Google Places API (Nearby Search New).
3. **Interaction**: Employs a gesture-driven stack where `react-native-reanimated` handles real-time coordinate mapping.
4. **Persistence**: 
    - **Local**: Successful swipes are committed to a persisted Zustand store (via `AsyncStorage`).
    - **Cloud**: Actions are logged to Firebase Firestore for cross-device synchronization (Background Sync).
5. **Consumption**: Synchronized "Matches" are rendered in a high-density gallery with deep-linking for navigation.

---

## 2. Tech Stack Audit
| Library | Version | Purpose |
| :--- | :--- | :--- |
| **Expo SDK** | `~52.0.28` | Managed workflow for cross-platform stability. |
| **NativeWind** | `^4.0.36` | Tailwind CSS for React Native; ensures consistent styling. |
| **Zustand** | `^5.0.3` | Lightweight, performant state management with persistence. |
| **Firebase** | `^11.1.0` | Firestore (NoSQL) and Anonymous Auth for rapid onboarding. |
| **Reanimated** | `~3.16.1` | 60fps gesture-based animations on the UI thread. |
| **Gesture Handler** | `~2.20.2` | Native-driven touch response. |
| **Lucide Icons** | `^0.562.0` | Scalable vector icons for a premium UI. |
| **Axios** | `^1.13.2` | Robust HTTP client for Google API integration. |

---

## 3. Folder & Module Structure
- `/app`: Root routing and screen definitions via `expo-router`.
- `/components`: Atomized UI components.
    - `SwipeCard.tsx`: Individual restaurant entity with physics.
    - `SwipeStack.tsx`: Logic container for Z-index and stack performance.
- `/hooks`: Encapsulated business logic.
    - `useRestaurants.ts`: API orchestration and pagination logic.
    - `useAppStore.ts`: Global state and persistence layer.
- `/services`: Backend and external API drivers (Firebase, Image Service).
- `/assets`: Static design assets and brand guidelines.

---

## 4. Data & State Architecture

### Zustand Store (`useAppStore`)
- **State**: `likedRestaurants` (Array of Restaurant objects).
- **Actions**: `addLikedRestaurant`, `removeLikedRestaurant`, `clearLikes`.
- **Persistence**: Using `AsyncStorage` via `persist` middleware.
- **Strategy**: Optimistic UI updates ensure zero latency for the user.

### Firebase Schema
- **Collection: `users`**
    - `uid`: Unique identifier from Firebase Auth (Anonymous).
    - `likes` (Sub-collection): Stores restaurant metadata for cross-device retrieval.
- **Indexing**: Optimized for temporal queries (latest matches first).

### API Mapping
Google Places API returns a `places.v1` object. We transform this via `useRestaurants.ts` into a strictly typed `Restaurant` interface:
```typescript
interface Restaurant {
    id: string;
    name: string;
    rating?: number;
    address?: string;
    photo_reference?: string;
    price_level?: number;
}
```

---

## 5. Core Logic & Physics (Swipe Engine)
- **Neutral Position**: `{ x: 0, y: 0, rotation: 0 }`.
- **Physics**: Uses `withSpring` for snap-back and `withTiming` for ejection.
- **Threshold**: COMMIT if `abs(translationX) > screenWidth * 0.35`.
- **Rotation Formula**: `interpolate(x, [-width, 0, width], [-15, 0, 15])` degrees.
- **Stack Logic**: Renders 3 items. Background items utilize progressive scaling (`1 - (pos * 0.05)`) and translation (`pos * 12`).

---

## 6. Scenario & Edge Case Analysis
| Scenario | Current Handling | Architect's Recommendation |
| :--- | :--- | :--- |
| **No Internet** | Generic Axios error catch. | Implement a dedicated "Offline" banner and queue swipes. |
| **Location Denied** | Fallback to Mock Data (Discover). | Prompt user to manually enter a zip code or city. |
| **API Limit Reached** | Error state with log. | Cache results in Firestore to reduce API calls for popular areas. |
| **Empty Results** | "Hunting for flavors..." placeholder. | Expand search radius automatically or suggest filters. |
| **Firestore Failures** | Local-only (Zustand will re-sync). | Implement a retry-loop with exponential backoff. |

---

## 7. Visual Audit Status
- **Current Parity**: 100% agreement with `design-specs.md` regarding typography (`Plus Jakarta Sans`), colors (`#FF512E`), and corner radii (`28px`).
- **Technical Debt**:
    - [ ] `useRestaurants` needs more robust error boundary implementation.
    - [ ] Firebase logging is currently optimistic in Zustand; needs background sync integration.
    - [ ] Filter logic in `DiscoverScreen` is a placeholder.

---
*End of Documentation*
