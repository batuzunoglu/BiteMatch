import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useAppStore } from '../../hooks/useAppStore';
import { getRestaurantPhotoUri } from '../../services/imageService';
import { MapPin, Navigation, Phone, ChevronRight, SlidersHorizontal, Search, Heart } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function MatchesScreen() {
    const { likedRestaurants, removeLikedRestaurant } = useAppStore();

    const openDirections = (item: any) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}`;
        Linking.openURL(url).catch((err) => console.error("Failed to open maps:", err));
    };

    return (
        <View className="flex-1 bg-accent p-6 pt-14">
            <View className="mb-6 flex-row justify-between items-center">
                <Text style={{ fontFamily: 'PlusJakartaSans-ExtraBold', fontWeight: '800', fontSize: 30, letterSpacing: -0.75, color: '#1D0F0C' }}>Your Matches</Text>
                <TouchableOpacity
                    className="w-10 h-10 bg-white rounded-full items-center justify-center border border-zinc-100"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 5,
                        elevation: 1
                    }}
                >
                    <SlidersHorizontal size={18} color="#1D0F0C" />
                </TouchableOpacity>
            </View>

            {/* Rounded Search Bar */}
            <View className="mb-8 bg-zinc-100 h-14 rounded-full flex-row items-center px-6 border border-zinc-200/50">
                <Search size={20} color="#94A3B8" />
                <TextInput
                    placeholder="Search your matches..."
                    placeholderTextColor="#94A3B8"
                    style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1D0F0C', fontFamily: 'PlusJakartaSans-Medium' }}
                />
            </View>

            {likedRestaurants.length === 0 ? (
                <View className="flex-1 items-center justify-center -mt-20">
                    <View className="w-32 h-32 rounded-full bg-white/5 items-center justify-center border border-white/10">
                        <Heart size={64} color="#E2E8F0" strokeWidth={1} />
                    </View>
                    <Text className="text-gray-400 font-bold mt-8 text-center text-lg leading-6 px-10">
                        No matches yet. Swipe more to build your collection!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={likedRestaurants}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    contentContainerStyle={{ gap: 16, paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: 24,
                                padding: 14,
                                marginBottom: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.04,
                                shadowRadius: 20,
                                elevation: 2,
                                width: '100%'
                            }}
                        >
                            <Image
                                source={getRestaurantPhotoUri(item.photo_reference)}
                                style={{ width: 80, height: 80, borderRadius: 16 }}
                                contentFit="cover"
                            />

                            <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                                <Text
                                    style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 17 }}
                                    className="text-dark leading-tight"
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                    className="text-zinc-500 text-[13px] mt-1 mb-3"
                                >
                                    {item.cuisine || 'Restaurant'} • 0.5 miles
                                </Text>

                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Phone size={14} color="#FF512E" strokeWidth={2.5} />
                                        <Text style={{ color: '#FF512E', fontFamily: 'PlusJakartaSans-Bold', fontWeight: '700', fontSize: 11, letterSpacing: 0.6 }}>CALL</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => openDirections(item)}
                                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                    >
                                        <Navigation size={14} color="#FF512E" strokeWidth={2.5} />
                                        <Text style={{ color: '#FF512E', fontFamily: 'PlusJakartaSans-Bold', fontWeight: '700', fontSize: 11, letterSpacing: 0.6 }}>DIRECTIONS</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ChevronRight size={18} color="#E2E8F0" />
                        </View>
                    )}
                />
            )}
        </View>
    );
}
