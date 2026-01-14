# Technical Spec: Swipe Logic Engine

## 1. Interaction Framework
- **Primary Library:** `react-native-reanimated` (v3).
- **Gesture Handler:** `react-native-gesture-handler` (PanGesture).
- **Architecture:** The top card handles the gesture; the underlying cards are static until the top card is dismissed.

## 2. Mathematical Logic (Coordinate Mapping)
- **Neutral Position:** `{ x: 0, y: 0, rotation: 0 }`.
- **Horizontal Threshold:** Swipe is committed if `translationX > screenWidth * 0.35` (Right) or `translationX < -screenWidth * 0.35` (Left).
- **Rotation Formula:** `rotation = interpolate(translationX, [-screenWidth, 0, screenWidth], [-15, 0, 15])` (degrees).
- **Opacity Overlay:** - "LIKE" label appears when `translationX > 50`, opacity scales with distance.
    - "NOPE" label appears when `translationX < -50`, opacity scales with distance.

## 3. Animation States
- **Active State (Dragging):** Real-time tracking of `sharedValues`.
- **Released (Under Threshold):** Use `withSpring` to snap back to `{ x: 0, y: 0 }`.
- **Released (Above Threshold):** Use `withTiming` to fly off-screen (e.g., `x: screenWidth * 1.5`) followed by a callback to update state.

## 4. State Synchronization (Zustand)
- **Callback `onSwipeComplete(direction)`**: 
    1. Triggers **Optimistic UI update**: Immediately remove the top item from the local array.
    2. Triggers **Background Sync**: Call Firebase service to log the action.
    3. Triggers **Haptic Feedback**: Use `expo-haptics` (Impact: Medium).

## 5. Performance Constraints
- **Hardware Acceleration:** Ensure `useAnimatedStyle` only uses `transform` and `opacity`.
- **Z-Index Management:** Maintain a maximum of 3 cards in the DOM tree at any time to preserve memory.