import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, Alert, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../hooks/useAuth';
import { useRestaurants } from '../../hooks/useRestaurants';
import { useAppStore } from '../../hooks/useAppStore';
import { SwipeStack } from '../../components/SwipeStack';
import { LocationPrompt } from '../../components/LocationPrompt';
import { X, Heart, RotateCcw, SlidersHorizontal, User } from 'lucide-react-native';
import { MatchOverlay } from '../../components/MatchOverlay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate card dimensions based on reference aspect ratio (3/4)
// On shorter screens, we cap the width so the height doesn't overlap header/buttons
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, (SCREEN_HEIGHT - 300) * 0.75);
const CARD_HEIGHT = CARD_WIDTH * (4 / 3);

export default function DiscoverScreen() {
    const { user, loading: authLoading } = useAuth();
    const { restaurants, loading: restaurantsLoading, refetch } = useRestaurants();
    const likedRestaurants = useAppStore((state) => state.likedRestaurants);
    const addLike = useAppStore((state) => state.addLikedRestaurant);

    const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
    const [showPrompt, setShowPrompt] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchedRestaurant, setMatchedRestaurant] = useState<any>(null);
    const [showMatchOverlay, setShowMatchOverlay] = useState(false);

    const handleSwipeLeft = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const handleSwipeRight = () => {
        const currentlySwiped = restaurants[currentIndex];
        if (currentlySwiped) {
            addLike(currentlySwiped);
            setMatchedRestaurant(currentlySwiped);
            setShowMatchOverlay(true);
        }
        setCurrentIndex((prev) => prev + 1);
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            setLocationPermission(status);
            if (status === Location.PermissionStatus.GRANTED) {
                setShowPrompt(false);
                const location = await Location.getCurrentPositionAsync({});
                refetch(location.coords.latitude, location.coords.longitude);
            }
        })();
    }, []);

    const handleRequestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);
        setShowPrompt(false);

        if (status === Location.PermissionStatus.GRANTED) {
            const location = await Location.getCurrentPositionAsync({});
            refetch(location.coords.latitude, location.coords.longitude);
        } else {
            Alert.alert(
                "Permission Denied",
                "We need your location to find nearby restaurants. Using mock data for now.",
                [{ text: "OK", onPress: () => refetch() }]
            );
        }
    };

    if (authLoading || (restaurantsLoading && restaurants.length === 0)) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="#FF4B2B" />
            </View>
        );
    }

    if (showPrompt && locationPermission !== Location.PermissionStatus.GRANTED) {
        return <LocationPrompt onAccept={handleRequestLocation} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F6F5' }}>
            {/* Header Area */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: '#f1f5f9' }}>
                    <User size={22} color="#1D0F0C" />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontWeight: '800', fontSize: 10, color: '#FF512E', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Discover</Text>
                    <Text style={{ fontFamily: 'PlusJakartaSans-ExtraBold', fontWeight: '800', fontSize: 18, color: '#1D0F0C', letterSpacing: -0.5 }}>BiteMatch</Text>
                </View>

                <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: '#f1f5f9' }}>
                    <SlidersHorizontal size={22} color="#1D0F0C" />
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, flexDirection: 'column' }}>
                {/* Swipe Card Container - Flex 1 to take all available space */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {restaurants.length > currentIndex ? (
                        <SwipeStack
                            data={restaurants}
                            currentIndex={currentIndex}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    ) : (
                        <View style={{ width: '100%', aspectRatio: 3 / 4, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#FF512E" />
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold', color: '#94A3B8', marginTop: 16, letterSpacing: 1, textTransform: 'uppercase', fontSize: 10 }}>Hunting for flavors...</Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons Area - Naturally below the card area */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, paddingVertical: 32 }}>
                    {/* Dislike/X Button */}
                    <TouchableOpacity
                        onPress={handleSwipeLeft}
                        activeOpacity={0.7}
                        style={{
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
                        }}
                    >
                        <X size={32} color="#a15445" strokeWidth={2.5} />
                    </TouchableOpacity>

                    {/* Rewind/Undo Button */}
                    <TouchableOpacity
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#FFFFFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.08,
                            shadowRadius: 16,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}
                    >
                        <RotateCcw size={20} color="#f59e0b" strokeWidth={2} />
                    </TouchableOpacity>

                    {/* Like/Heart Button */}
                    <TouchableOpacity
                        onPress={handleSwipeRight}
                        activeOpacity={0.9}
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#FF512E',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#FF512E',
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.3,
                            shadowRadius: 24,
                            elevation: 10
                        }}
                    >
                        <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Match Success Overlay */}
            <MatchOverlay
                isVisible={showMatchOverlay}
                onClose={() => setShowMatchOverlay(false)}
                onViewDetails={() => setShowMatchOverlay(false)}
                matchedRestaurant={matchedRestaurant}
            />
        </SafeAreaView>
    );
}
