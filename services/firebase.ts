import { initializeApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import * as FirebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// Use existing app if already initialized (hot reload support)
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (e) {
    app = getApp();
}

export { app };
export const db = getFirestore(app);

// Initialize Auth with Persistence
let auth: Auth;
try {
    // @ts-ignore - getReactNativePersistence is available in runtime but missing from types
    const getReactNativePersistence = (FirebaseAuth as any).getReactNativePersistence;

    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (e: any) {
    // If auth is already initialized, use the existing instance
    auth = getAuth(app);
}

export { auth };
