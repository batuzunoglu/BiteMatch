import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Heart, UtensilsCrossed, Share2, Utensils } from 'lucide-react-native';
import { getRestaurantPhotoUri } from '../services/imageService';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface MatchOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    onViewDetails: () => void;
    matchedRestaurant: {
        name: string;
        photo_reference: string;
    } | null;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({
    isVisible,
    onClose,
    onViewDetails,
    matchedRestaurant
}) => {
    if (!matchedRestaurant) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Background Layer: Blurred Restaurant Image + Gradient Overlay */}
                <View style={StyleSheet.absoluteFill}>
                    <Image
                        source={getRestaurantPhotoUri(matchedRestaurant.photo_reference)}
                        style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.2 }] }]}
                        contentFit="cover"
                        blurRadius={40}
                    />
                    <LinearGradient
                        colors={['rgba(255, 81, 46, 0.8)', 'rgba(255, 81, 46, 0.4)', 'rgba(255, 183, 94, 0.6)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                <View style={styles.content}>
                    {/* Avatars */}
                    <View style={styles.circlesContainer}>
                        <View style={styles.avatarCircle}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?u=batu' }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.restaurantCircle}>
                            <Image
                                source={getRestaurantPhotoUri(matchedRestaurant.photo_reference)}
                                style={styles.image}
                            />
                            <View style={styles.heartBadge}>
                                <Heart size={20} color="white" fill="white" />
                            </View>
                        </View>
                    </View>

                    <Text style={styles.title}>It's a Match!</Text>
                    <Text style={styles.subtitle}>
                        You and <Text style={styles.bold}>{matchedRestaurant.name}</Text> are a perfect pair.
                    </Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            onPress={onViewDetails}
                            style={styles.detailsButton}
                        >
                            <Text style={styles.detailsButtonText}>View Details</Text>
                            <Utensils size={20} color="#ff512e" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.keepSwipingButton}
                        >
                            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
                        </TouchableOpacity>
                    </View>

                    <BlurView intensity={30} tint="light" style={styles.shareBadge}>
                        <Share2 size={14} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.shareText}>SHARE THIS FIND</Text>
                    </BlurView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 32,
    },
    circlesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarCircle: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        borderColor: 'white',
        overflow: 'hidden',
        zIndex: 2,
        marginRight: -24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    restaurantCircle: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        borderColor: 'white',
        overflow: 'hidden',
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ff512e',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    title: {
        fontSize: 48,
        fontFamily: 'PlusJakartaSans-ExtraBold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -2.4,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Medium',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    bold: {
        fontFamily: 'PlusJakartaSans-Bold',
        textDecorationLine: 'underline',
        textDecorationColor: 'rgba(255, 183, 94, 0.5)',
    },
    buttonGroup: {
        width: '100%',
        paddingHorizontal: 8,
        gap: 16,
    },
    detailsButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderRadius: 24,
        shadowColor: 'rgba(0,0,0,0.12)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 30,
    },
    detailsButtonText: {
        color: '#ff512e',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 18,
    },
    keepSwipingButton: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keepSwipingText: {
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 16,
    },
    shareBadge: {
        marginTop: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 99,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    shareText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontFamily: 'PlusJakartaSans-ExtraBold',
        letterSpacing: 2,
        marginLeft: 8,
    }
});
