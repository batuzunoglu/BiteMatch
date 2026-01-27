import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
    onAuthStateChanged,
    User,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    linkWithCredential,
    EmailAuthProvider,
    signOut as firebaseSignOut,
    deleteUser,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile,
    signInWithCredential,
    OAuthProvider
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { auth } from '../services/firebase';
import { useAppStore } from './useAppStore';
import { firestoreService } from '../services/firestoreService';
import Toast from 'react-native-toast-message';

WebBrowser.maybeCompleteAuthSession();

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { hydrateStore, clearStore } = useAppStore();

    // Configure Google Sign-In
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'dummy-ios-client-id',
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const data = await firestoreService.fetchInitialData(currentUser.uid);
                    const interactionIds = data.interactions.map(i => i.id);
                    const matches = data.matches.map(m => ({
                        id: m.id,
                        name: m.name,
                        photo_reference: m.photo_reference,
                        rating: m.rating,
                        price_level: m.price_level,
                        address: m.address
                    }));
                    hydrateStore(matches, interactionIds);
                } catch (error: any) {
                    if (error.code === 'permission-denied') {
                        console.warn("[Auth] Cloud sync permission denied. Running in local-only mode.");
                    } else {
                        console.error("Hydration failed:", error);
                    }
                }
            } else {
                clearStore();
            }

            setLoading(false);
        });

        // Initialize Anonymous Sign In if not logged in
        if (!auth.currentUser) {
            signInAnonymously(auth).catch((error) => {
                // If API key is missing, this will fail. We handle it silently to not crash the UI.
                console.warn("Anonymous sign-in attempted but failed (Key issue?):", error.message);
                setLoading(false);
            });
        }

        return unsubscribe;
    }, []);

    // Handle Google Sign-In Response
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);

            // Sign in or Link
            const performSignIn = async () => {
                try {
                    if (user?.isAnonymous) {
                        // Ideally we link, but for simplicity we'll try to sign in and if needed, link logic isn't fully robust here
                        // without handling account-exists-with-different-credential manually.
                        // But signInWithCredential will sign in to the google account.
                        await signInWithCredential(auth, credential);
                        // If we wanted to MERGE, we would link. But `linkWithCredential` throws if the google account exists.
                        // For now, this behaves as "Switch to Google Account".
                        Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Signed in with Google.' });
                    } else {
                        await signInWithCredential(auth, credential);
                        Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Signed in with Google.' });
                    }
                } catch (error: any) {
                    console.error("Google Credential Sign In Failed", error);
                    Toast.show({ type: 'error', text1: 'Google Sign In Failed', text2: error.message });
                }
            };
            performSignIn();
        }
    }, [response]);


    const signUp = async (email: string, pass: string) => {
        try {
            if (user?.isAnonymous) {
                // Link anonymous account to email/password
                const credential = EmailAuthProvider.credential(email, pass);
                await linkWithCredential(user, credential);
                Toast.show({ type: 'success', text1: 'Account Secured!', text2: 'Your progress has been saved.' });
            } else {
                await createUserWithEmailAndPassword(auth, email, pass);
                Toast.show({ type: 'success', text1: 'Welcome to BiteMatch!' });
            }
        } catch (error: any) {
            console.error("Sign up failed:", error);
            Toast.show({ type: 'error', text1: 'Sign Up Failed', text2: error.message });
            throw error;
        }
    };

    const signIn = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            Toast.show({ type: 'success', text1: 'Welcome Back!' });
        } catch (error: any) {
            console.error("Sign in failed:", error);
            Toast.show({ type: 'error', text1: 'Sign In Failed', text2: error.message });
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        if (Platform.OS === 'web') {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Signed in with Google.' });
            } catch (error: any) {
                console.error("Google Sign In failed:", error);
                Toast.show({ type: 'error', text1: 'Google Sign In Failed', text2: error.message });
                // throw error; // Don't crash
            }
        } else {
            // Native Flow
            promptAsync();
        }
    };

    const signInWithApple = async () => {
        try {
            const csrf = Math.random().toString(36).substring(2, 15);
            const nonce = Math.random().toString(36).substring(2, 10);
            const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);

            const appleCredential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            });

            const { identityToken } = appleCredential;

            if (!identityToken) {
                throw new Error('No identity token provided.');
            }

            const provider = new OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });

            await signInWithCredential(auth, credential);
            Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Signed in with Apple.' });
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
            } else {
                console.error("Apple Sign In Failed", e);
                Toast.show({ type: 'error', text1: 'Apple Sign In Failed', text2: e.message });
            }
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({ type: 'success', text1: 'Email Sent', text2: 'Check your inbox to reset password.' });
        } catch (error: any) {
            console.error("Reset password failed:", error);
            Toast.show({ type: 'error', text1: 'Failed to send email', text2: error.message });
            throw error;
        }
    };

    const updateUserProfile = async (displayName: string, photoURL?: string) => {
        if (!user) return;
        try {
            await updateProfile(user, { displayName, photoURL });
            // Force refresh user state if needed, but Firebase usually handles this.
            setUser({ ...user, displayName, photoURL } as User);
            Toast.show({ type: 'success', text1: 'Profile Updated!' });
        } catch (error: any) {
            console.error("Update profile failed:", error);
            Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message });
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            clearStore();
            // Automatically sign back in anonymously so the app remains functional
            await signInAnonymously(auth);
            Toast.show({ type: 'info', text1: 'Signed Out', text2: 'Guest mode active.' });
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    const deleteAccount = async () => {
        if (!user) return;
        try {
            await firestoreService.purgeUserData(user.uid);
            await deleteUser(user);
            clearStore();
            Toast.show({ type: 'success', text1: 'Account Deleted', text2: 'All data has been wiped.' });
        } catch (error) {
            console.error("Failed to delete account:", error);
            throw error;
        }
    };

    return { user, loading, signUp, signIn, signOut, deleteAccount, signInWithGoogle, signInWithApple, resetPassword, updateUserProfile };
};
