import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EMOJIS = [
    { id: 1, symbol: '😡', label: 'Angry' },
    { id: 2, symbol: '😕', label: 'Confused' },
    { id: 3, symbol: '😐', label: 'Neutral' },
    { id: 4, symbol: '🙂', label: 'Happy' },
    { id: 5, symbol: '😍', label: 'Loved' },
];

const IMPROVEMENT_CHIPS = [
    'UI/Design', 'App Speed', 'Swipe Logic', 'Matches', 'Chat', 'Other'
];

export default function GiveFeedbackScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [rating, setRating] = useState<number | null>(null);
    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const toggleChip = (chip: string) => {
        if (selectedChips.includes(chip)) {
            setSelectedChips(prev => prev.filter(c => c !== chip));
        } else {
            setSelectedChips(prev => [...prev, chip]);
        }
    };

    const handleSubmit = () => {
        if (Platform.OS === 'web') {
            window.alert('Thank you for your feedback!');
        } else {
            Alert.alert('Success', 'Thank you for your feedback!');
        }
        router.push('/(tabs)/profile');
    };

    return (
        <View className="flex-1 bg-[#0F172A]" style={{ minHeight: Platform.OS === 'web' ? '100vh' : '100%' } as any}>
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-6 z-50 bg-[#0F172A]/90"
                style={{ paddingTop: Math.max(insets.top, 20), paddingBottom: 20 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/10 items-center justify-center backdrop-blur-md"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-xl">
                    Give Feedback
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* Emoji Rating */}
                <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-lg mb-6 text-center">
                    How was your experience?
                </Text>
                <View className="flex-row justify-between mb-10 px-2">
                    {EMOJIS.map((emoji) => (
                        <TouchableOpacity
                            key={emoji.id}
                            onPress={() => setRating(emoji.id)}
                            className={`items-center justify-center p-2 rounded-2xl transition-all ${rating === emoji.id ? 'bg-white/10 scale-110' : ''}`}
                            style={{ transform: [{ scale: rating === emoji.id ? 1.1 : 1 }] }}
                        >
                            <Text style={{ fontSize: 40, opacity: rating === emoji.id || rating === null ? 1 : 0.5 }}>
                                {emoji.symbol}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Improvement Chips */}
                <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-lg mb-4">
                    What can we improve?
                </Text>
                <View className="flex-row flex-wrap gap-3 mb-10">
                    {IMPROVEMENT_CHIPS.map((chip) => (
                        <TouchableOpacity
                            key={chip}
                            onPress={() => toggleChip(chip)}
                            className={`px-4 py-2 rounded-full border ${selectedChips.includes(chip) ? 'bg-[#FF512E] border-[#FF512E]' : 'bg-transparent border-white/20'}`}
                        >
                            <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className={`text-sm ${selectedChips.includes(chip) ? 'text-white' : 'text-gray-400'}`}>
                                {chip}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Comment Box */}
                <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-lg mb-4">
                    Anything else?
                </Text>
                <View className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-2">
                    <TextInput
                        multiline
                        numberOfLines={6}
                        placeholder="Tell us about your experience..."
                        placeholderTextColor="#6B7280"
                        value={comment}
                        onChangeText={setComment}
                        maxLength={500}
                        style={{ fontFamily: 'PlusJakartaSans-Medium', color: 'white', height: 120, textAlignVertical: 'top', outlineStyle: 'none' } as any}
                    />
                </View>
                <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-500 text-right text-xs">
                    {comment.length}/500
                </Text>

            </ScrollView>

            {/* Submit Button */}
            <View
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F172A] to-transparent pt-10"
                style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="w-full shadow-lg shadow-orange-500/20"
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#F25D00', '#FF007F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                    >
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-lg">
                            Submit Feedback
                        </Text>
                        <Send size={20} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}
