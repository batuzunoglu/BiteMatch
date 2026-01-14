import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

import { useAppStore } from './useAppStore';
import { firestoreService } from '../services/firestoreService';
import { deleteUser } from 'firebase/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { hydrateStore, clearStore } = useAppStore();

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
                } catch (error) {
                    console.error("Hydration failed:", error);
                }
            } else {
                clearStore();
            }

            setLoading(false);
        });

        if (!auth.currentUser) {
            signInAnonymously(auth).catch((error) => {
                console.error("Anonymous sign-in failed", error);
            });
        }

        return unsubscribe;
    }, []);

    const deleteAccount = async () => {
        if (!user) return;
        try {
            await firestoreService.purgeUserData(user.uid);
            await deleteUser(user);
            clearStore();
        } catch (error) {
            console.error("Failed to delete account:", error);
            throw error;
        }
    };

    return { user, loading, deleteAccount };
};
