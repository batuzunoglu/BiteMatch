import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SwipeCard } from './SwipeCard';
import { Restaurant } from '../hooks/useRestaurants';
import { useAppStore } from '../hooks/useAppStore';
import Toast from 'react-native-toast-message';
import Animated, { useAnimatedStyle, interpolate, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, (SCREEN_HEIGHT - 300) * 0.75);

interface SwipeStackProps {
    data: Restaurant[];
    currentIndex: number;
    onSwipeLeft: (restaurant: Restaurant) => void;
    onSwipeRight: (restaurant: Restaurant) => void;
    userLocation?: { latitude: number; longitude: number };
}

export const SwipeStack: React.FC<SwipeStackProps> = ({
    data,
    currentIndex,
    onSwipeLeft,
    onSwipeRight,
    userLocation,
}) => {

    const visibleCards = data
        .slice(currentIndex, currentIndex + 3)
        .reverse();

    return (
        <View style={styles.container}>
            {visibleCards.map((item, index) => {
                const totalCards = visibleCards.length;
                const isFirst = index === totalCards - 1;
                // Position in the stack from top (0) to bottom (2)
                const stackPosition = totalCards - 1 - index;

                return (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.cardWrapper,
                            !isFirst && {
                                transform: [
                                    { scale: 1 - (stackPosition * 0.05) },
                                    { translateY: stackPosition * 12 }
                                ],
                                opacity: 1 - (stackPosition * 0.3),
                                zIndex: -stackPosition
                            }
                        ]}
                    >
                        <SwipeCard
                            restaurant={item}
                            onSwipeLeft={onSwipeLeft}
                            onSwipeRight={onSwipeRight}
                            isFirst={isFirst}
                            userLocation={userLocation}
                        />
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        aspectRatio: 3 / 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
