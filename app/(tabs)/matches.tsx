import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, Dimensions, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useAppStore } from '../../hooks/useAppStore';
import { getRestaurantPhotoUri } from '../../services/imageService';
import { MapPin, Navigation, Phone, ChevronRight, SlidersHorizontal, Search, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MatchesScreen() {
    const { likedRestaurants, removeLikedRestaurant } = useAppStore();
    const insets = useSafeAreaInsets();

    const openDirections = (item: any) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + (item.address || ''))}`;
        Linking.openURL(url).catch((err) => console.error("Failed to open maps:", err));
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f6f5' }}>
            {/* Top Navigation Bar */}
            <View
                style={{
                    paddingTop: Math.max(insets.top, 24),
                    paddingHorizontal: 24,
                    paddingBottom: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Text style={{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 28,
                    color: '#1D0F0C',
                    letterSpacing: -0.5
                }}>
                    Your Matches
                </Text>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#FFFFFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.04,
                            shadowRadius: 10,
                            elevation: 2
                        }}
                    >
                        <SlidersHorizontal size={20} color="#52525b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#FFFFFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.04,
                            shadowRadius: 10,
                            elevation: 2
                        }}
                    >
                        <Search size={20} color="#52525b" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content Area */}
            <View style={{ flex: 1, paddingHorizontal: 24 }}>
                {/* Search Bar */}
                <View
                    style={{
                        marginVertical: 16,
                        backgroundColor: 'white',
                        height: 52,
                        borderRadius: 9999,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 18,
                        borderWidth: 1,
                        borderColor: '#f4f4f5',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.04,
                        shadowRadius: 12,
                        elevation: 2
                    }}
                >
                    <Search size={20} color="#94A3B8" />
                    <TextInput
                        placeholder="Search matched restaurants"
                        placeholderTextColor="#94A3B8"
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            fontSize: 16,
                            color: '#1D0F0C',
                            fontFamily: 'PlusJakartaSans-Medium'
                        }}
                    />
                </View>

                {likedRestaurants.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={56} color="#CBD5E1" strokeWidth={1} />
                        </View>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Bold',
                            color: '#94A3B8',
                            marginTop: 24,
                            textAlign: 'center',
                            fontSize: 18,
                            paddingHorizontal: 40
                        }}>
                            No matches yet. Swipe more to build your collection!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={likedRestaurants}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 28,
                                    padding: 14,
                                    marginBottom: 16,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.04,
                                    shadowRadius: 20,
                                    elevation: 2,
                                    borderWidth: 1,
                                    borderColor: '#f4f4f5'
                                }}
                            >
                                <Image
                                    source={getRestaurantPhotoUri(item.photo_reference)}
                                    style={{ width: 84, height: 84, borderRadius: 12 }}
                                    contentFit="cover"
                                />

                                <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 18, color: '#1D0F0C' }}
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontFamily: 'PlusJakartaSans-Medium',
                                                    fontSize: 14,
                                                    color: '#71717a',
                                                    marginTop: 4
                                                }}
                                            >
                                                Japanese • 0.5 miles
                                            </Text>

                                            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                    <Phone size={15} color="#FF512E" strokeWidth={2.5} />
                                                    <Text style={{ color: '#FF512E', fontFamily: 'PlusJakartaSans-Bold', fontSize: 12, letterSpacing: 0.5 }}>CALL</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => openDirections(item)}
                                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                                                >
                                                    <Navigation size={15} color="#FF512E" strokeWidth={2.5} />
                                                    <Text style={{ color: '#FF512E', fontFamily: 'PlusJakartaSans-Bold', fontSize: 12, letterSpacing: 0.5 }}>DIRECTIONS</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <ChevronRight size={18} color="#d4d4d8" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
}
