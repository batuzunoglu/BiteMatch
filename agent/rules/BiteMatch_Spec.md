# Project Specification: BiteMatch

## 1. Vision
A Tinder-style restaurant discovery app where users swipe through nearby restaurants.

## 2. Core User Flow
- Permission: Ask for device location.
- Data Fetching: Fetch nearest 20 restaurants from Google Places API based on lat/lng.
- Interaction: User swipes Right (Like) or Left (Skip).
- Storage: Saved "Likes" are stored in Firebase Firestore under user's profile.
- Result: A "Matches" screen showing all liked restaurants with contact/navigation buttons.

## 3. Database Strategy (NoSQL)
- Database: Firebase Firestore.
- Focus: Speed and horizontal scalability. Schema-less storage of restaurant metadata.