# BiteMatch: System Architecture & Technical Documentation

**Version:** 2.1.0--Production-Verified
**Status:** Audit Completed
**Author:** Antigravity (Senior Technical Architect)

---

## 1. System Overview
BiteMatch is a high-performance discovery platform designed for the "Tinder-style" restaurant matching experience. The architecture prioritizes fluid animations, optimistic UI updates, and real-time data synchronization.

### Core 'Swipe-to-Match' Flow
1. **Bootstrap**: Application requests location permissions via `expo-location` and initializes the "Welcome Logic".
2. **Ingestion**: Fetches the nearest 20 restaurants using the **Google Places API (New v1 SearchNearby)**.
3. **Interaction**: Employs a gesture-driven stack where `react-native-reanimated` handles real-time coordinate mapping.
4. **Persistence**:
    - **Local**: Successful swipes are committed to a persisted Zustand store (via `AsyncStorage`) with custom **Set rehydration**.
    - **Cloud**: Actions are logged to Firebase Firestore for cross-device synchronization (Background Sync).
5. **Consumption**: Synchronized "Matches" are rendered in a high-density gallery, and the Profile screen utilizes a **Bento-Grid** layout for statistical tracking.

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
    - `(tabs)`: Main tab navigation (Swipe, Matches, Profile).
    - `welcome.tsx`: Onboarding logic.
- `/components`: Atomized UI components.
    - `SwipeCard.tsx`: Individual restaurant entity with physics.
    - `SwipeStack.tsx`: Logic container for Z-index and stack performance.
- `/hooks`: Encapsulated business logic.
    - `useRestaurants.ts`: API orchestration and pagination logic.
    - `useAppStore.ts`: Global state and persistence layer.
    - `useAuth.ts`: Progressive authentication strategies.
    - `useSync.ts`: Background synchronization queue.
- `/services`: Backend and external API drivers.
    - `firestoreService.ts`: **Strictly Typed** Firebase interactions.
    - `imageService.ts`: Google Photos URL signing and refreshing.
- `/assets`: Static design assets and brand guidelines.

---

## 4. Infrastructure & Identity

### Progressive Auth (Firebase v11)
BiteMatch implements a friction-free "Progressive Authentication" flow to maximize conversion:
1. **Anonymous Session**: Upon first launch, users are silently signed in via `signInAnonymously`.
2. **Persistence**: All swipes/matches are tied to this anonymous `uid`.
3. **Account Linking**: Users can "Save Progress" by linking their anonymous session to a permanent credential (Email/Password or Google) via `linkWithCredential`.
    - *Verified*: `useAuth.ts` handles the `isAnonymous` check and conditional linking logic.

### Firestore Data Model
- **Collection: `users`**
    - `uid`: Unique identifier.
    - **Sub-collection: `interactions`** (Swipe History)
        - Document ID: `placeId`
        - Fields: `type` ('like'|'dislike'), `timestamp`
        - *Purpose*: Deduplication pool to ensure users never see the same card twice.
    - **Sub-collection: `matches`** (Denormalized Data)
        - Document ID: `placeId`
        - Fields: `Restaurant` object (`name`, `photo_reference`, `rating`, `price_level`, `address`, `location`) + `syncedAt`
        - *Purpose*: Read-optimized collection for the "Matches" tab, eliminating the need for secondary API calls.

---

## 5. Google Places API Integration

### v1 SearchNearby Policy
We have migrated strictly to the **New Places API (v1)** using the POST endpoint:
`https://places.googleapis.com/v1/places:searchNearby`

### Cost Optimization (Field Masking)
To prevent over-fetching and minimize billing, every request strictly implements `X-Goog-FieldMask`:
- **Allowed Fields**:
  - `places.id`, `places.displayName`
  - `places.rating`, `places.userRatingCount`
  - `places.formattedAddress`, `places.priceLevel`
  - `places.photos`
  - `places.location`

### Photo Refresh Logic
Google Media URLs have a short TTL. To handle expiration:
- **Service**: `services/imageService.ts`
- **Logic**: If an image fails to load, the `fetchFreshPhotoUri` hook is triggered to request a new signed URL from the endpoint, ensuring the UI never breaks.

---

## 6. Core Logic & Physics (Swipe Engine)
- **Neutral Position**: `{ x: 0, y: 0, rotation: 0 }`.
- **Physics**: Uses `withSpring` for snap-back and `withTiming` for ejection. Transitions use `runOnJS` to bridge UI and business logic threads.
- **Threshold**: COMMIT if `abs(translationX) > screenWidth * 0.35` (approx 130px).
- **Rotation Formula**: `interpolate(x, [-width, 0, width], [-10, 0, 10])` degrees (Refined for subtlety).
- **Stack Logic**: Renders 3 items. Background items utilize progressive scaling (`1 - (pos * 0.05)`) and translation (`pos * 12`) for depth.

---

## 7. State Management & Persistence

### Zustand + AsyncStorage
The app uses a hybrid persistence strategy:
- **Store**: `useAppStore.ts`
- **Middleware**: `persist` with `createJSONStorage` wrapping `AsyncStorage`.

### Custom Type Rehydration
JSON cannot natively serialize ES6 `Set` (used for O(1) lookups of swiped IDs).
- **Serialization (`partialize`)**: Converts `swipedIds` (Set) → `Array`.
- **Deserialization (`merge`)**: Converts `Array` → `swipedIds` (Set) during hydration.

### Optimistic UI & Background Sync
1. **Action**: User swipes right.
2. **Optimistic Update**: UI immediately runs `addSwipe`, updating the local `Set` and `likedRestaurants` array (60fps feedback).
3. **Background Sync**: A `pendingSync` queue handles the network request. `useSync.ts` monitors this queue and flushes it to Firestore via `firestoreService.ts`.

---

## 8. Premium UI & Design System

### Visual Components
- **Bento-Grid Profile**: The Profile screen (`profile.tsx`) features a modular bento-style layout for key metrics ("Matches" count, "Pro Member" status).
- **Glassmorphism**:
  - **Hero Cards**: Profile and Welcome screens use `LinearGradient` + `BlurView` layers to create frosted glass effects.
  - **Swipe Cards**: Bottom gradients (`rgba(0,0,0,0.8)`) ensure text readability over dynamic food photography.
- **Micro-Interactions**: Lucide icons (`Utensils`, `Heart`, `MapPin`) provide vector-sharp visuals at all scales.

### Design Specs Parity
- **Corner Radius**: `28px` (Cards) / `32px` (Bento Tiles).
- **Typography**: `Plus Jakarta Sans` (ExtraBold for Headers, Medium/Bold for UI text).
- **Brand Palette**: Primary `#FF512E`, Accent Pink `#FF007F`, Surface `#F9F9F9`.

---

## 9. Policies & Edge Cases

### Hard Reset Policy
When a user "Unmatches" or resets a card:
- The system executes a **Dual Delete** in `firestoreService.deleteMatch`:
  1. Delete from `/matches/{placeId}` (removes from UI).
  2. Delete from `/interactions/{placeId}` (allows the card to reappear in the stack).

### GDPR & Account Purge
- **Service**: `firestoreService.purgeUserData(uid)`
- **Process**:
  1. Batch delete all documents in `matches` sub-collection.
  2. Batch delete all documents in `interactions` sub-collection.
  3. Delete the root `user` document.
  4. Calls Firebase Auth `deleteUser()`.
  5. Clears local device storage (`clearStore`).

### Cloud-to-Local Hydration
On login (or re-install), the `useAuth` hook triggers `fetchInitialData`.
- Fetches the user's Firestore collections (limit 50).
- Re-populates the local Zustand store (restoring the `swipedIds` Set and `likedRestaurants` array) to ensure seamless continuity across devices.

---

## 10. Technical Debt & Roadmap
- [ ] **Bloom Filters**: Implement server-side probabilistic filtering for `swipedIds` to reduce payload size as user history grows (>1000 swipes).
- [ ] **API Quota Managers**: Add robust error boundaries in `useRestaurants` to gracefully handle `429 Too Many Requests` or quota exhaustion (fallback to cached/mock data).
- [ ] **Filter Modal**: Implement the UI for filtering by Price Level/Rating (Logic exists, UI pending).

---
*End of Documentation*
