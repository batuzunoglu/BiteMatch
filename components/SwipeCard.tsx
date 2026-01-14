import React from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Restaurant } from '../hooks/useRestaurants';
import { Image } from 'expo-image';
import { getRestaurantPhotoUri } from '../services/imageService';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Star } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, (SCREEN_HEIGHT - 300) * 0.75);
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

interface SwipeCardProps {
    restaurant: Restaurant;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    isFirst: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
    restaurant,
    onSwipeLeft,
    onSwipeRight,
    isFirst,
}) => {
    const translateX = useSharedValue(0);

    const gesture = Gesture.Pan()
        .enabled(isFirst)
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction = event.translationX > 0 ? 1 : -1;
                translateX.value = withTiming(
                    direction * SCREEN_WIDTH * 1.5,
                    { duration: 300 },
                    () => {
                        if (direction > 0) {
                            runOnJS(onSwipeRight)();
                        } else {
                            runOnJS(onSwipeLeft)();
                        }
                    }
                );
                // Safe Haptics call
                if (Platform.OS !== 'web') {
                    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
                }
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            [-15, 0, 15]
        );

        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

    const likeLabelStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, 50, SWIPE_THRESHOLD],
            [0, 0, 1]
        );
        return { opacity };
    });

    const nopeLabelStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, -50, 0],
            [1, 0, 0]
        );
        return { opacity };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    {
                        width: CARD_WIDTH,
                        aspectRatio: 3 / 4,
                        borderRadius: 28,
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 20 },
                        shadowOpacity: 0.1,
                        shadowRadius: 30,
                        elevation: 10,
                        overflow: 'hidden',
                    },
                    animatedStyle,
                ]}
            >
                {/* Full-Bleed Image */}
                <Image
                    source={getRestaurantPhotoUri(restaurant.photo_reference)}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    contentFit="cover"
                    priority="high"
                    cachePolicy="disk"
                />

                {/* Bottom Gradient Overlay (Glass Overlay) */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
                    locations={[0, 0.4, 1]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }}
                />

                {/* Info Container */}
                <View style={{ flex: 1, justifyContent: 'flex-end', padding: 24, zIndex: 20 }}>
                    <View style={{ transform: [{ translateY: 8 }] }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Text
                                style={{ fontFamily: 'PlusJakartaSans-ExtraBold', fontWeight: '800', fontSize: 32, color: '#FFFFFF', letterSpacing: -0.8 }}
                                numberOfLines={1}
                            >
                                {restaurant.name}
                            </Text>
                            {restaurant.rating && (
                                <View
                                    className="px-3 py-1 flex-row items-center gap-1.5"
                                    style={{ borderRadius: 12, backgroundColor: '#FF512E', alignSelf: 'flex-start' }}
                                >
                                    <Star size={12} color="white" fill="white" strokeWidth={0} />
                                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontWeight: '800', fontSize: 13, color: '#FFFFFF' }}>
                                        {restaurant.rating}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <MapPin size={18} color="#FFFFFF" strokeWidth={2.5} />
                                <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontWeight: '700', fontSize: 15, color: '#FFFFFF' }}>
                                    1.2 km away
                                </Text>
                            </View>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' }} />
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontWeight: '800', fontSize: 20, color: '#FFFFFF' }}>
                                {'$'.repeat(restaurant.price_level || 3)}
                            </Text>
                        </View>

                        {/* Category Pills */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                                <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontWeight: '800', color: '#FFFFFF', fontSize: 11, letterSpacing: 0.5 }}>ARTISANAL</Text>
                            </View>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                                <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontWeight: '800', color: '#FFFFFF', fontSize: 11, letterSpacing: 0.5 }}>LATE NIGHT</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};
