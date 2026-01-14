# Design Specification: BiteMatch Brand & UI

## 1. Visual Identity (Vibe)
- **Theme:** Warm, vibrant, and appetizing.
- **Primary Color:** `#FF4B2B` (Bite Red/Orange).
- **Secondary Color:** `#FFB75E` (Sunset Gold).
- **Background:** `#FAFAFA` (Off-white) for cards, `#FFFFFF` for the matches gallery.
- **Typography:** System fonts (San Francisco for iOS, Roboto for Android). Titles should be `font-bold`, Body should be `font-medium`.

## 2. Component Design (Shadcn-like for Mobile)
- **Cards:** - `borderRadius: 24px`.
    - Subtle shadow: `shadow-opacity: 0.15, shadow-radius: 10`.
    - Content overlay: Linear gradient from `transparent` to `rgba(0,0,0,0.8)` at the bottom for text readability.
- **Buttons:**
    - Swipe buttons (Circle): Left (Gray/X icon), Right (Orange/Heart icon).
    - Haptic feedback on every press using `expo-haptics`.

## 3. Swipe Experience
- **Smoothness:** Aim for 60fps. Avoid heavy re-renders on the background cards.
- **Micro-interactions:** When swiping right, the "LIKE" badge should have a slight elastic scaling effect.