import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Flame, X, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Mock Data ---

const DIETARY_GOALS = [
    { id: 'vegan', label: 'Vegan', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500' },
    { id: 'vegetarian', label: 'Vegetarian', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500' },
    { id: 'gluten_free', label: 'Gluten Free', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500' },
    { id: 'halal', label: 'Halal', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=500' },
];

const ALLERGIES = [
    'Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish', 'Sesame', 'Peanuts', 'Corn'
];

interface SpiceLevel {
    level: 1 | 2 | 3 | 4;
    label: string;
    color: string;
}

const SPICE_LEVELS: SpiceLevel[] = [
    { level: 1, label: 'Mild', color: '#4ADE80' },
    { level: 2, label: 'Medium', color: '#FACC15' },
    { level: 3, label: 'Hot', color: '#FB923C' },
    { level: 4, label: 'Extra Hot', color: '#EF4444' },
];

export default function DietaryPreferencesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // State
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [allergySearch, setAllergySearch] = useState('');
    const [spiceLevel, setSpiceLevel] = useState<number>(2);
    const [isSaving, setIsSaving] = useState(false);

    // Handlers
    const toggleGoal = (id: string) => {
        setSelectedGoals(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const toggleAllergy = (allergy: string) => {
        if (!selectedAllergies.includes(allergy)) {
            setSelectedAllergies(prev => [...prev, allergy]);
        }
    };

    const removeAllergy = (allergy: string) => {
        setSelectedAllergies(prev => prev.filter(a => a !== allergy));
    };

    const filteredAllergies = ALLERGIES.filter(a =>
        a.toLowerCase().includes(allergySearch.toLowerCase()) &&
        !selectedAllergies.includes(a)
    );

    const handleSave = () => {
        if (Platform.OS === 'web') {
            window.alert('Success: Preferences saved!');
        } else {
            console.log('Preferences saved');
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
                    Dietary Preferences
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Intro Text */}
                <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-400 text-center mb-10">
                    Customize your discovery experience. We'll prioritize restaurants that match your lifestyle.
                </Text>

                {/* Section 1: Dietary Goals */}
                <View className="mb-10">
                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-xl mb-4">
                        Dietary Goals
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        {DIETARY_GOALS.map((goal) => {
                            const isSelected = selectedGoals.includes(goal.id);

                            return (
                                <TouchableOpacity
                                    key={goal.id}
                                    onPress={() => toggleGoal(goal.id)}
                                    activeOpacity={0.8}
                                    className="w-[48%] h-40 rounded-2xl overflow-hidden relative bg-slate-800 mb-4"
                                >
                                    <View className={`absolute inset-0 z-10 border-4 rounded-2xl ${isSelected ? 'border-[#FF512E]' : 'border-transparent'}`} />
                                    <Image
                                        source={{ uri: goal.image }}
                                        style={{ width: '100%', height: '100%' }}
                                        contentFit="cover"
                                        transition={200}
                                        className="opacity-90"
                                    />
                                    {/* Gradient Overlay for Text Visibility */}
                                    <LinearGradient
                                        colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' }}
                                    />

                                    {/* Content */}
                                    <View className="absolute bottom-0 left-0 right-0 p-4 z-20 flex-row items-center justify-between">
                                        <Text
                                            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                            className="text-white text-lg shadow-sm"
                                        >
                                            {goal.label}
                                        </Text>
                                        {isSelected && (
                                            <View className="bg-[#FF512E] rounded-full p-1.5 shadow-lg">
                                                <Check size={14} color="white" strokeWidth={4} />
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Section 2: Allergies */}
                <View className="mb-10">
                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-xl mb-4">
                        Allergies & Restrictions
                    </Text>

                    {/* Search Bar */}
                    <View className="bg-white/5 rounded-xl flex-row items-center px-4 py-3 border border-white/10 mb-4 h-12">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search allergies (e.g. Peanuts)"
                            placeholderTextColor="#6B7280"
                            style={{ fontFamily: 'PlusJakartaSans-Medium', flex: 1, marginLeft: 10, color: 'white', height: '100%', outlineStyle: 'none' } as any}
                            value={allergySearch}
                            onChangeText={setAllergySearch}
                        />
                    </View>

                    {/* Selected Tags */}
                    {selectedAllergies.length > 0 && (
                        <View className="flex-row flex-wrap gap-2 mb-4">
                            {selectedAllergies.map(allergy => (
                                <TouchableOpacity
                                    key={allergy}
                                    onPress={() => removeAllergy(allergy)}
                                    className="flex-row items-center bg-[#FF512E]/20 border border-[#FF512E]/50 rounded-full px-3 py-1.5"
                                >
                                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-[#FF512E] mr-2 text-sm">{allergy}</Text>
                                    <X size={14} color="#FF512E" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Suggestions */}
                    {allergySearch.length > 0 && (
                        <View className=" bg-white/5 rounded-xl p-2 border border-white/10">
                            {filteredAllergies.length === 0 ? (
                                <Text className="text-gray-500 p-2">No matches found</Text>
                            ) : (
                                filteredAllergies.map(allergy => (
                                    <TouchableOpacity
                                        key={allergy}
                                        onPress={() => {
                                            toggleAllergy(allergy);
                                            setAllergySearch('');
                                        }}
                                        className="py-3 px-3 border-b border-white/5"
                                    >
                                        <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-300">{allergy}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </View>

                {/* Section 3: Spice Level */}
                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-xl">
                            Spice Tolerance
                        </Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold', color: SPICE_LEVELS[spiceLevel - 1].color }} className="text-lg">
                            {SPICE_LEVELS[spiceLevel - 1].label}
                        </Text>
                    </View>

                    <View className="bg-white/5 rounded-2xl p-6 border border-white/10 items-center">
                        <View className="flex-row justify-between w-full relative h-12 items-center">
                            {/* Track Line */}
                            <View className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 rounded-full -mt-0.5" />

                            {SPICE_LEVELS.map((level) => {
                                const isActive = spiceLevel >= level.level;
                                const isCurrent = spiceLevel === level.level;

                                return (
                                    <TouchableOpacity
                                        key={level.level}
                                        onPress={() => setSpiceLevel(level.level)}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: isActive ? level.color : '#334155',
                                            transform: [{ scale: isCurrent ? 1.2 : 1 }]
                                        }}
                                        className="w-10 h-10 rounded-full items-center justify-center shadow-lg z-10"
                                    >
                                        <Flame size={isCurrent ? 20 : 16} color={isActive ? 'white' : '#94A3B8'} fill={isActive ? 'white' : 'transparent'} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View className="flex-row justify-between w-full mt-4 px-1">
                            {SPICE_LEVELS.map((l) => (
                                <Text key={l.level} style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 10, width: 40, textAlign: 'center', opacity: spiceLevel === l.level ? 1 : 0.4 }} className="text-white">
                                    {l.label.toUpperCase()}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button (Fixed) */}
            <View
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F172A] to-transparent pt-10"
                style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isSaving}
                    className="w-full shadow-lg shadow-orange-500/20"
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#F25D00', '#FF007F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-lg">
                                Save Preferences
                            </Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}
