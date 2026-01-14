# Rule: Final Guardrails (Security & UX)

## 1. Security First
- **No Hardcoding:** Hardcoded API keys are a critical failure. Always use `.env.local`.
- **Git Safety:** Ensure `.env` is in `.gitignore` before the first commit.

## 2. Development Efficiency (Mocking)
- **API Strategy:** Create a `useRestaurants` hook that toggles between `MOCK_DATA` and `REAL_API` based on an environment variable `EXPO_PUBLIC_API_MODE`.
- **Default:** Keep it on `MOCK` during UI/Swipe logic development.

## 3. UX Polish
- **Location Flow:** Do not trigger the OS permission dialog immediately. Show an introductory UI explaining the benefit of location access.
- **Error Handling:** Every async operation must be wrapped in `try/catch` with a user-friendly Toast message (using `react-native-toast-message`).