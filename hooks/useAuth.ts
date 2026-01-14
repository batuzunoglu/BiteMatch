import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Auto sign-in anonymously if no user is present (for BiteMatch discovery experience)
        if (!auth.currentUser) {
            signInAnonymously(auth).catch((error) => {
                console.error("Anonymous sign-in failed", error);
            });
        }

        return unsubscribe;
    }, []);

    return { user, loading };
};
