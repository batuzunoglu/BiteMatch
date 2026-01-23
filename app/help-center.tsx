import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    CreditCard,
    BookOpen,
    ShieldCheck,
    MessageCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function HelpCenterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const QuickActionTile = ({ icon: Icon, label, color, delay }: any) => (
        <TouchableOpacity
            className="w-[48%] aspect-square bg-white/5 rounded-3xl items-center justify-center border border-white/5 mb-4 active:bg-white/10"
            activeOpacity={0.7}
        >
            <View
                className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: `${color}20` }} // 20% opacity of the color
            >
                <Icon size={24} color={color} strokeWidth={2.5} />
            </View>
            <Text
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                className="text-white text-[15px] tracking-tight"
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const FAQItem = ({ question }: { question: string }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-white/5"
            activeOpacity={0.7}
        >
            <Text
                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                className="text-white/90 text-[15px] flex-1 mr-4"
            >
                {question}
            </Text>
            <ChevronRight size={18} color="#6B7280" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-[#0A0F1E]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View
                style={{ paddingTop: 60, paddingBottom: 20 }}
                className="px-6 flex-row items-center justify-between bg-[#0A0F1E] z-10"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                    className="text-white text-lg"
                >
                    Help Center
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View className="flex-row items-center bg-white/10 rounded-2xl px-4 py-3.5 mb-8 border border-white/5">
                    <Search size={20} color="rgba(255,255,255,0.4)" className="mr-3" />
                    <TextInput
                        placeholder="How can we help?"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                        className="flex-1 text-white text-base"
                    />
                </View>

                {/* Quick Action Grid */}
                <View className="flex-row flex-wrap justify-between mb-8">
                    <QuickActionTile
                        icon={User}
                        label="Account"
                        color="#2DD4BF" // Teal
                    />
                    <QuickActionTile
                        icon={CreditCard}
                        label="Payments"
                        color="#F472B6" // Pink
                    />
                    <QuickActionTile
                        icon={BookOpen}
                        label="App Guide"
                        color="#FB7185" // Rose
                    />
                    <QuickActionTile
                        icon={ShieldCheck}
                        label="Safety"
                        color="#4ADE80" // Green
                    />
                </View>

                {/* FAQ Section */}
                <View className="mb-8">
                    <Text
                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                        className="text-gray-500 text-xs tracking-widest mb-4 uppercase"
                    >
                        Frequently Asked Questions
                    </Text>
                    <View className="bg-white/5 rounded-3xl px-5 border border-white/5">
                        <FAQItem question="How do I change my location?" />
                        <FAQItem question="What is a 'Bite Match'?" />
                        <FAQItem question="How to cancel a reservation?" />
                        <View className="flex-row items-center justify-between py-4">
                            <Text
                                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                className="text-[#FF512E] text-[15px]"
                            >
                                View all FAQs
                            </Text>
                            <ChevronRight size={18} color="#FF512E" />
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom CTA */}
            <View
                className="absolute bottom-0 left-0 right-0 p-6 pt-0"
                style={{
                    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
                    // Gradient fade up logic could go here, but simple padding works for now
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    className="shadow-lg shadow-[#FF512E]/30"
                >
                    <LinearGradient
                        colors={['#FF512E', '#FF007F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="flex-row items-center justify-center py-4 rounded-full"
                    >
                        <MessageCircle size={20} color="white" strokeWidth={2.5} className="mr-2" />
                        <Text
                            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                            className="text-white text-base"
                        >
                            Chat with us
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}
