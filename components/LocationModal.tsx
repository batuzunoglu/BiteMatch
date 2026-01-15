import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { MapPin, ArrowRight, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LocationModalProps {
    isVisible: boolean;
    onAccept: () => void;
    onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isVisible, onAccept, onClose }) => {
    const handleAccept = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onAccept();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <X size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={['#FF512E', '#fcde6a']}
                            style={styles.iconGradient}
                        >
                            <MapPin size={32} color="white" strokeWidth={2.5} />
                        </LinearGradient>
                    </View>

                    <Text style={styles.modalTitle}>Find Tasty Spots Nearby</Text>
                    <Text style={styles.modalText}>
                        BiteMatch needs your location to show you the best restaurants right in your neighborhood.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleAccept}
                        style={styles.buttonShadow}
                    >
                        <LinearGradient
                            colors={['#FF512E', '#fcde6a']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Allow Location</Text>
                            <ArrowRight size={20} color="white" strokeWidth={3} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.notNowButton}
                    >
                        <Text style={styles.notNowText}>Not now, use mock data</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 8,
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF512E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    modalTitle: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 24,
        color: '#1D0F0C',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 30,
    },
    modalText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
        paddingHorizontal: 15,
    },
    buttonShadow: {
        width: '100%',
        shadowColor: '#FF512E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    button: {
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 18,
        color: 'white',
    },
    notNowButton: {
        marginTop: 20,
        padding: 10,
    },
    notNowText: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: 14,
        color: '#94A3B8',
        textDecorationLine: 'underline',
    },
});
