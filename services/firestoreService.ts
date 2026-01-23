import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Restaurant } from '../hooks/useRestaurants';

export interface Interaction {
    id: string; // Document ID
    type: 'like' | 'dislike';
    timestamp: any;
}

// We save the full Restaurant object + syncedAt for sorting
export type Match = Restaurant & { syncedAt: any };

export const firestoreService = {
    /**
     * Saves a user interaction (swipe) to Firestore.
     * Used for history tracking and preventing duplicate cards.
     */
    saveInteraction: async (uid: string, placeId: string, type: 'like' | 'dislike'): Promise<void> => {
        try {
            const interactionRef = doc(db, 'users', uid, 'interactions', placeId);
            await setDoc(interactionRef, {
                type,
                timestamp: serverTimestamp(),
            });
        } catch (error: any) {
            console.error(`[Firestore] saveInteraction failed: ${error.message}`);
            throw error;
        }
    },

    /**
     * Saves a matched restaurant to the matches collection.
     * Denormalized storage for fast access in the Matches tab.
     */
    saveMatch: async (uid: string, restaurant: Restaurant): Promise<void> => {
        try {
            const matchRef = doc(db, 'users', uid, 'matches', restaurant.id);
            const data: Match = {
                ...restaurant,
                syncedAt: serverTimestamp(),
            };
            await setDoc(matchRef, data);
        } catch (error: any) {
            console.error(`[Firestore] saveMatch failed: ${error.message}`);
            throw error;
        }
    },

    /**
     * HARD RESET POLICY:
     * Deletes a restaurant from BOTH matches and interactions.
     * This allows the user to potentially see the card again if they re-enter the stack info.
     * Uses a batch write for atomicity.
     */
    deleteMatch: async (uid: string, placeId: string): Promise<void> => {
        try {
            const batch = writeBatch(db);
            const matchRef = doc(db, 'users', uid, 'matches', placeId);
            const interactionRef = doc(db, 'users', uid, 'interactions', placeId);

            batch.delete(matchRef);
            batch.delete(interactionRef);

            await batch.commit();
        } catch (error: any) {
            console.error(`[Firestore] deleteMatch failed: ${error.message}`);
            throw error;
        }
    },

    /**
     * Hydrates the local store with initial data from Firestore.
     * Returns robustly typed matches and interaction history.
     */
    fetchInitialData: async (uid: string): Promise<{ matches: Match[], interactions: Interaction[] }> => {
        try {
            const matchesRef = collection(db, 'users', uid, 'matches');
            const interactionsRef = collection(db, 'users', uid, 'interactions');

            // Parallel fetch for simplified latency
            const [matchesSnap, interactionsSnap] = await Promise.all([
                getDocs(query(matchesRef, orderBy('syncedAt', 'desc'), limit(50))),
                getDocs(query(interactionsRef, orderBy('timestamp', 'desc'), limit(500)))
            ]);

            const matches = matchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
            const interactions = interactionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interaction));

            return { matches, interactions };
        } catch (error: any) {
            console.error(`[Firestore] fetchInitialData failed: ${error.message}`);
            throw error;
        }
    },

    /**
     * GDPR COMPLIANCE:
     * Permanently purges all user data from Firestore sub-collections and root document.
     */
    purgeUserData: async (uid: string): Promise<void> => {
        try {
            const batch = writeBatch(db);
            const matchesRef = collection(db, 'users', uid, 'matches');
            const interactionsRef = collection(db, 'users', uid, 'interactions');

            // Snapshot all docs to delete them
            const [matchesSnap, interactionsSnap] = await Promise.all([
                getDocs(matchesRef),
                getDocs(interactionsRef)
            ]);

            matchesSnap.docs.forEach((doc) => batch.delete(doc.ref));
            interactionsSnap.docs.forEach((doc) => batch.delete(doc.ref));

            // Delete user root doc
            batch.delete(doc(db, 'users', uid));

            await batch.commit();
        } catch (error: any) {
            console.error(`[Firestore] purgeUserData failed: ${error.message}`);
            throw error;
        }
    }
};
