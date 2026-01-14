import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../hooks/useAuth';
import { useRestaurants } from '../../hooks/useRestaurants';
import { useAppStore } from '../../hooks/useAppStore';
import { SwipeStack } from '../../components/SwipeStack';
import { X, Heart, RotateCcw, SlidersHorizontal, User } from 'lucide-react-native';
import { MatchOverlay } from '../../components/MatchOverlay';
import { LocationModal } from '../../components/LocationModal';

export default function DiscoverScreen() {
    const { user, loading: authLoading } = useAuth();
    const { restaurants, loading: restaurantsLoading, refetch } = useRestaurants();
    const { addSwipe } = useAppStore();

    const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchedRestaurant, setMatchedRestaurant] = useState<any>(null);
    const [showMatchOverlay, setShowMatchOverlay] = useState(false);

    const handleSwipeRight = (restaurant: any) => {
        addSwipe(restaurant, 'like');
        setMatchedRestaurant(restaurant);
        setShowMatchOverlay(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleSwipeLeft = (restaurant: any) => {
        addSwipe(restaurant, 'dislike');
        setCurrentIndex((prev) => prev + 1);
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            setLocationPermission(status);
            if (status === Location.PermissionStatus.GRANTED) {
                const location = await Location.getCurrentPositionAsync({});
                refetch(location.coords.latitude, location.coords.longitude);
            } else if (status === Location.PermissionStatus.UNDETERMINED) {
                setShowLocationModal(true);
            }
        })();
    }, []);

    const handleRequestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);
        setShowLocationModal(false);

        if (status === Location.PermissionStatus.GRANTED) {
            const location = await Location.getCurrentPositionAsync({});
            refetch(location.coords.latitude, location.coords.longitude);
        } else {
            // Re-fetch with mock data if denied
            refetch();
        }
    };

    if (authLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F6F5' }}>
                <ActivityIndicator size="large" color="#FF512E" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F6F5' }}>
            {/* Header Area */}
            <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.headerButton}>
                    <User size={22} color="#1D0F0C" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.headerSubtitle}>Discover</Text>
                    <Text style={styles.headerTitle}>BiteMatch</Text>
                </View>

                <TouchableOpacity style={styles.headerButton}>
                    <SlidersHorizontal size={22} color="#1D0F0C" />
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: 'center' }}>
                {restaurantsLoading && restaurants.length === 0 ? (
                    <View style={{ alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#FF512E" />
                        <Text style={styles.loadingText}>Hunting for flavors...</Text>
                    </View>
                ) : restaurants.length > currentIndex ? (
                    <View style={{ alignItems: 'center' }}>
                        <SwipeStack
                            data={restaurants}
                            currentIndex={currentIndex}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    </View>
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <RotateCcw size={48} color="#CBD5E1" strokeWidth={1} />
                        <Text style={styles.loadingText}>No more options nearby!</Text>
                        <TouchableOpacity
                            onPress={() => refetch()}
                            style={styles.refreshButton}
                        >
                            <Text style={styles.refreshButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        onPress={() => restaurants[currentIndex] && handleSwipeLeft(restaurants[currentIndex])}
                        style={styles.actionButtonSecondary}
                    >
                        <X size={32} color="#a15445" strokeWidth={2.5} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => restaurants[currentIndex] && handleSwipeRight(restaurants[currentIndex])}
                        style={[styles.actionButtonPrimary, { backgroundColor: '#FF512E' }]}
                    >
                        <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modals & Overlays */}
            <LocationModal
                isVisible={showLocationModal}
                onAccept={handleRequestLocation}
                onClose={() => setShowLocationModal(false)}
            />

            <MatchOverlay
                isVisible={showMatchOverlay}
                onClose={() => setShowMatchOverlay(false)}
                onViewDetails={() => setShowMatchOverlay(false)}
                matchedRestaurant={matchedRestaurant}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    headerSubtitle: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 10,
        color: '#FF512E',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 2
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 20,
        color: '#1D0F0C',
        letterSpacing: -0.5
    },
    loadingText: {
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#94A3B8',
        marginTop: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontSize: 10
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        marginTop: 40,
        marginBottom: 20
    },
    actionButtonSecondary: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    actionButtonPrimary: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF512E',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 10
    },
    refreshButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#FF512E',
        borderRadius: 99,
    },
    refreshButtonText: {
        color: 'white',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 14,
    }
});
