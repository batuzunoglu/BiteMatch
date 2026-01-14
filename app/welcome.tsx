import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { UtensilsCrossed, ArrowRight } from 'lucide-react-native';
import { useAppStore } from '../hooks/useAppStore';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FOOD_IMAGES = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD09nq-ro61fhccztehymZwAlBe_CW4FMPIQSvIvtwfsFVTUTh9jw3zJkWiEmjjZWLpwL_X-V4GTsCmkBjC345k9mr8dlav_oAYRbrz4leMyxrFLTI2eVgPzQtMS5CIQKDZZcyCL6OIiwsr0FtXyQipqrPElQlNqVWB-HnWdfVK4YSc9YMgC3TLDMyuS4yB4zYXyFYqtLr3whcWmgStwsvPGHtg3Hjfm15TKZVEBC6XtPAggA43CvlnIqMekIJ1Yc2TKub3h6UHqdY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBnkOjEL0SisKl64PTi0GQvURFQJRy7ozQOoNXKhNMHLO7nGrXEkm0UmrUhsskbnygZfJ0g-RHZgoM0s4fcBCpGd1mp87WgaXGnZSW8ilgngQu7d2mYu-u2Fi9r4JELK6X4NI8SL_ji0S9D2NtDae1QIUb8butGNwWEeJ3aEGuj37rybHeAvJSscnX3FUABnP4Lh43Y-bsKgX09e9BVV9rp8C73-JbxIlrDVzqmY_Jzq8MH_IrDbRHPjbe7rbDDYFTsgOfuUC94Bc8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQFi3zPN-t4hK282CZMjI0NoB55DlybkrAyLK6PmPM-EF2Yva3B51Q9VJ1m89XyHFZ0y7imViNptq50upVvo8bWbWDVNLQBykElZnvoxFDSTI396DrLTBKIGfjFoC1GPSyMDt3oJsix6YFvQCx0wu25v3pPB9Q4sd42ttFOB_sECPOzs5xT-PhKcK9csQ87x3dPVUCqx7hJQX5WTZteyfYuwqJ4Sy_w9xJrr5o_ni38SHW7ZSV_4EGfqoeFg843tWng-QWhfdF3nU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAv0hMoAWcpdwaOfvO2akBgshJt9gRs3m0eW8RdYPh1Zt2-xDPDuhg9adD8uOSKMjsVSUMJPvpLrK9BCuQka1b0nxJ6di18aEzSDLZLjewqSCF56jATtkjBs0eKJ4vE1bD_sKku3u0ll4OyYusaRueACU25ha__24Hysi-9eYd9ADjS8RPw9Cjicss2E-6b7jB9rAXo-ldolFzQyaVhht3dy4KU3DzCuGgJ6o422eBeTP5hMilakqw_Afzpklj_RClgA8wjjvXktOg',
];

export default function WelcomeScreen() {
    const completeOnboarding = useAppStore((state) => state.completeOnboarding);
    const router = useRouter();

    const handleGetStarted = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeOnboarding();
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* Hero Section (65%) */}
            <View style={styles.heroContainer}>
                {/* Background Collage */}
                <View style={styles.grid}>
                    {FOOD_IMAGES.map((uri, index) => (
                        <Image
                            key={index}
                            source={{ uri }}
                            style={styles.gridImage}
                            contentFit="cover"
                        />
                    ))}
                </View>

                {/* Sunset Overlay */}
                <LinearGradient
                    colors={['rgba(255, 81, 46, 0.4)', 'rgba(255, 81, 46, 0.8)', '#ff512e']}
                    style={styles.overlay}
                />

                {/* Brand Content */}
                <View style={styles.brandContent}>
                    <BlurView intensity={30} style={styles.logoBlur}>
                        <UtensilsCrossed size={48} color="white" />
                    </BlurView>
                    <Text style={styles.title}>BiteMatch</Text>
                    <Text style={styles.subtitle}>Swipe. Crave. Eat. Find your perfect plate.</Text>
                </View>
            </View>

            {/* Action Zone (40%) */}
            <View style={styles.actionZone}>
                <View style={styles.textContent}>
                    <Text style={styles.headline}>Hungry for something new?</Text>
                    <Text style={styles.description}>
                        Discover the best dishes in town, curated just for your taste buds.
                    </Text>
                </View>

                {/* Primary Action */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleGetStarted}
                    style={styles.buttonShadow}
                >
                    <LinearGradient
                        colors={['#ff512e', '#fcde6a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <ArrowRight size={20} color="white" strokeWidth={3} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Secondary Action */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <Text style={styles.signInLink}>Sign In</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfaf9',
    },
    heroContainer: {
        height: '65%',
        width: '100%',
        overflow: 'hidden',
    },
    grid: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'black',
    },
    gridImage: {
        width: '50%',
        height: '50%',
        opacity: 0.8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9,
    },
    brandContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoBlur: {
        width: 84,
        height: 84,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        marginBottom: 16,
    },
    title: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 48,
        color: 'white',
        letterSpacing: -1,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
    },
    actionZone: {
        flex: 1,
        backgroundColor: '#fbfaf9',
        marginTop: -48,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 32,
        paddingTop: 40,
        paddingBottom: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 40,
        elevation: 10,
    },
    textContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    headline: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 24,
        color: '#1d0f0c',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 30,
    },
    description: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        color: '#a15445',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonShadow: {
        shadowColor: '#ff512e',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    button: {
        height: 64,
        borderRadius: 32,
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
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 14,
        color: '#6b7280',
    },
    signInLink: {
        color: '#ff512e',
        fontFamily: 'PlusJakartaSans-Bold',
        textDecorationLine: 'underline',
    },
});
