import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export interface Interaction {
    id: string;
    type: 'like' | 'dislike';
    timestamp: any;
}

export interface MatchMetadata {
    id: string;
    name: string;
    photo_reference?: string;
    rating?: number;
    price_level?: number;
    address?: string;
    syncedAt: any;
}

export const firestoreService = {
    // Save a swipe interaction
    saveInteraction: async (uid: string, placeId: string, type: 'like' | 'dislike') => {
        const interactionRef = doc(db, 'users', uid, 'interactions', placeId);
        await setDoc(interactionRef, {
            type,
            timestamp: serverTimestamp(),
        });
    },

    // Save match metadata (denormalization)
    saveMatch: async (uid: string, placeId: string, metadata: Omit<MatchMetadata, 'syncedAt'>) => {
        const matchRef = doc(db, 'users', uid, 'matches', placeId);
        await setDoc(matchRef, {
            ...metadata,
            syncedAt: serverTimestamp(),
        });
    },

    // Delete a match (Hard Reset)
    deleteMatch: async (uid: string, placeId: string) => {
        const batch = writeBatch(db);
        const matchRef = doc(db, 'users', uid, 'matches', placeId);
        const interactionRef = doc(db, 'users', uid, 'interactions', placeId);

        batch.delete(matchRef);
        batch.delete(interactionRef);
        await batch.commit();
    },

    // Hydrate local store from Cloud
    fetchInitialData: async (uid: string) => {
        const matchesRef = collection(db, 'users', uid, 'matches');
        const interactionsRef = collection(db, 'users', uid, 'interactions');

        const [matchesSnap, interactionsSnap] = await Promise.all([
            getDocs(query(matchesRef, orderBy('syncedAt', 'desc'), limit(50))),
            getDocs(query(interactionsRef, orderBy('timestamp', 'desc'), limit(100)))
        ]);

        const matches = matchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchMetadata));
        const interactions = interactionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interaction));

        return { matches, interactions };
    },

    // Purge all user data (GDPR)
    purgeUserData: async (uid: string) => {
        // Note: For deep sub-collections in production, a Cloud Function is preferred.
        // For this architecture, we will batch delete the known sub-collections.
        const batch = writeBatch(db);

        const matchesRef = collection(db, 'users', uid, 'matches');
        const interactionsRef = collection(db, 'users', uid, 'interactions');

        const [matchesSnap, interactionsSnap] = await Promise.all([
            getDocs(matchesRef),
            getDocs(interactionsRef)
        ]);

        matchesSnap.docs.forEach(doc => batch.delete(doc.ref));
        interactionsSnap.docs.forEach(doc => batch.delete(doc.ref));

        // Also delete the user document itself
        batch.delete(doc(db, 'users', uid));

        await batch.commit();
    }
};
