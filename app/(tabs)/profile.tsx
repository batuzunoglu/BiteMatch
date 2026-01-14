import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../hooks/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
    User,
    Settings,
    ChevronRight,
    Heart,
    Utensils,
    LogOut,
    ShieldCheck,
    Smartphone,
    CircleUserRound,
    AlertCircle
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AuthModal } from '../../components/AuthModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
    const { user, signOut, deleteAccount } = useAuth();
    const { likedRestaurants, clearStore } = useAppStore();
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = React.useState(false);

    const isAnonymous = user?.isAnonymous || !user;

    const handleSignOut = () => {
        signOut();
    };

    const MenuButton = ({ icon: Icon, label, value, onPress, color = "#1A1A1A", showArrow = true }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-50 mr-4">
                    <Icon size={20} color={color} strokeWidth={2} />
                </View>
                <View className="flex-col">
                    <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="text-[15px] text-gray-900">
                        {label}
                    </Text>
                    {value && (
                        <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-xs text-gray-400 mt-0.5">
                            {value}
                        </Text>
                    )}
                </View>
            </View>
            {showArrow && <ChevronRight size={18} color="#D1D1D1" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Header Section */}
                <View className="px-6 pt-4 pb-8">
                    <View className="flex-row items-center justify-between mb-8">
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-3xl text-gray-900">
                            Profile
                        </Text>
                        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-gray-50">
                            <Settings size={22} color="#1A1A1A" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Card */}
                    <LinearGradient
                        colors={['#FF583D', '#FF8162']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 32 }}
                        className="p-1 shadow-lg shadow-orange-200"
                    >
                        <View className="bg-white/10 rounded-[31px] p-6 flex-row items-center">
                            <View className="w-20 h-20 rounded-full bg-white items-center justify-center border-4 border-white/20 overflow-hidden">
                                {user?.photoURL ? (
                                    <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                                ) : (
                                    <CircleUserRound size={40} color="#FF583D" strokeWidth={1.5} />
                                )}
                            </View>
                            <View className="ml-5 flex-1">
                                <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-xl text-white">
                                    {user?.displayName || (isAnonymous ? 'Guest User' : 'Bite Matcher')}
                                </Text>
                                <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-white/80 text-sm mt-1">
                                    {isAnonymous ? 'Sign in to save matches permanently' : user?.email}
                                </Text>
                                {isAnonymous && (
                                    <TouchableOpacity
                                        onPress={() => setShowAuthModal(true)}
                                        className="mt-3 bg-white self-start px-4 py-1.5 rounded-full"
                                    >
                                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-[#FF583D] text-xs">
                                            Finish Setup
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Stats Row */}
                <View className="flex-row px-6 justify-between mb-8">
                    <View className="flex-1 bg-gray-50 rounded-3xl p-4 mr-2 items-center justify-center">
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-2xl text-gray-900">
                            {likedRestaurants.length}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Heart size={14} color="#FF583D" fill="#FF583D" style={{ marginRight: 6 }} />
                            <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="text-gray-400 text-xs uppercase tracking-wider">
                                Matches
                            </Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-3xl p-4 ml-2 items-center justify-center">
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-2xl text-gray-900">
                            Gold
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <ShieldCheck size={14} color="#FFB800" style={{ marginRight: 6 }} />
                            <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="text-gray-400 text-xs uppercase tracking-wider">
                                Status
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="px-6 pb-12">
                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-gray-900 text-lg mb-4">
                        Account Settings
                    </Text>

                    <View>
                        <MenuButton
                            icon={CircleUserRound}
                            label="Personal Info"
                            value="Edit your profile details"
                        />
                        <MenuButton
                            icon={Smartphone}
                            label="Preferences"
                            value="Cuisine, dietary, and more"
                        />
                        <MenuButton
                            icon={ShieldCheck}
                            label="Privacy & Data"
                            value="Manage your account data"
                        />

                        <View className="mt-8">
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-gray-900 text-lg mb-4">
                                Support
                            </Text>
                            <MenuButton icon={AlertCircle} label="Help Center" />
                        </View>

                        <TouchableOpacity
                            onPress={handleSignOut}
                            className="mt-8 flex-row items-center py-4"
                        >
                            <View className="w-10 h-10 rounded-full items-center justify-center bg-red-50 mr-4">
                                <LogOut size={20} color="#FF3B30" strokeWidth={2} />
                            </View>
                            <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="text-[15px] text-red-500">
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <AuthModal
                isVisible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </SafeAreaView>
    );
}
