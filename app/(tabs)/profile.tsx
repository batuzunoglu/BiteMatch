import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../hooks/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
    Settings,
    ChevronRight,
    Heart,
    ShieldCheck,
    User,
    Utensils,
    HelpCircle, // Mapping help_center
    MessageSquare, // Mapping rate_review roughly
    LogOut,
    Pencil, // Mapping edit
    CircleUserRound
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AuthModal } from '../../components/AuthModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Exact colors from HTML config
const COLORS = {
    primary: "#ff512e",
    accentPink: "#FF007F",
    surfaceOff: "#F9F9F9",
    destructive: "#C24F5C",
    backgroundLight: "#ffffff",
    textMain: "#1A1A1A",
    textGray: "#9CA3AF" // gray-400
};

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { likedRestaurants } = useAppStore();
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = React.useState(false);
    const insets = useSafeAreaInsets();

    const isAnonymous = user?.isAnonymous || !user;

    const handleSignOut = () => {
        signOut();
    };

    // Helper for Menu Item
    const MenuItem = ({ icon: Icon, label, onPress, last = false }: any) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row items-center px-5 py-4 ${!last ? 'border-b border-gray-200/30' : ''}`}
        >
            <View className="w-10 h-10 rounded-xl bg-gray-200/50 items-center justify-center mr-4">
                <Icon size={20} color="#4B5563" strokeWidth={2} className="text-gray-600" />
            </View>
            <Text
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                className="flex-1 text-[15px] text-gray-700"
            >
                {label}
            </Text>
            <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white" style={{ flex: 1, height: '100%', minHeight: Platform.select({ web: '100vh', default: '100%' }) } as any}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                style={{ flex: 1 }}
                className="flex-1"
            >
                {/* Header Section */}
                {/* sticky top-0 ... px-6 pt-14 pb-4 -> mapped to RN padding */}
                <View
                    style={{ paddingTop: insets.top + 10 }}
                    className="px-6 pb-4 bg-white/80 z-50 sticky"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="w-10" />
                        <Text
                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                            className="text-lg text-[#1d0f0c] tracking-tight"
                        >
                            Profile
                        </Text>
                        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-transparent">
                            <Settings size={28} color="#1d0f0c" strokeWidth={2} />
                            {/* material-symbols-outlined text-2xl is roughly 24-28px */}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content: px-6 space-y-8 mt-4 */}
                <View className="px-6 mt-4 gap-8">

                    {/* Glassmorphic Hero Card */}
                    {/* class="glass-hero rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden" */}
                    <LinearGradient
                        colors={['#F25D00', '#FF007F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
                        className="p-8 items-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Abstract patterns */}
                        <View className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                        <View className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

                        {/* Avatar Group */}
                        <View className="relative mb-4">
                            <View className="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-xl">
                                {user?.photoURL ? (
                                    <Image source={{ uri: user.photoURL }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <View className="w-full h-full bg-[#EEC6B3] items-center justify-center">
                                        <CircleUserRound size={64} color="#8D6E63" strokeWidth={1.5} />
                                    </View>
                                )}
                            </View>
                            {/* Edit Badge */}
                            <TouchableOpacity
                                onPress={() => setShowEditProfileModal(true)}
                                className="absolute bottom-4 right-0 bg-white p-1.5 rounded-full shadow-lg border-2 border-[#FF512E]/10"
                            >
                                <Pencil size={18} color={COLORS.primary} strokeWidth={3} />
                            </TouchableOpacity>
                        </View>

                        {/* Name & Title */}
                        <Text
                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                            className="text-2xl text-white tracking-tight mb-1 text-center"
                        >
                            {user?.displayName || 'Alex Johnson'}
                        </Text>
                        <Text
                            style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            className="text-white/80 text-sm mb-6 text-center"
                        >
                            BiteMatch Platinum Explorer
                        </Text>

                        {/* Finish Setup Button */}
                        <TouchableOpacity
                            onPress={() => isAnonymous ? setShowAuthModal(true) : setShowEditProfileModal(true)}
                            className="bg-white px-6 py-2.5 rounded-full shadow-lg active:scale-95"
                        >
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-[#ff512e] text-sm">
                                {isAnonymous ? 'Finish Setup (80%)' : 'Edit Profile'}
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>


                    {/* Statistical Bento Tiles */}
                    {/* section flex gap-4 */}
                    <View className="flex-row gap-4">
                        {/* Tile 1 */}
                        <View className="flex-1 bg-[#F9F9F9] rounded-[32px] p-6 shadow-sm items-start gap-3">
                            <View className="w-10 h-10 rounded-2xl bg-[#ff512e]/10 items-center justify-center">
                                <Heart size={20} color={COLORS.primary} strokeWidth={3} />
                            </View>
                            <View>
                                <Text
                                    style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                    className="text-3xl text-[#1d0f0c] leading-none tracking-tighter"
                                >
                                    {likedRestaurants.length}
                                </Text>
                                <Text
                                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                    className="text-xs uppercase tracking-widest text-gray-400 mt-2"
                                >
                                    Matches
                                </Text>
                            </View>
                        </View>

                        {/* Tile 2 */}
                        <View className="flex-1 bg-[#F9F9F9] rounded-[32px] p-6 shadow-sm items-start gap-3">
                            <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center">
                                <ShieldCheck size={20} color="#F59E0B" strokeWidth={3} />
                                {/* Amber-500 is roughly #F59E0B */}
                            </View>
                            <View>
                                <Text
                                    style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                    className="text-2xl text-[#1d0f0c] leading-none tracking-tight"
                                >
                                    Pro
                                </Text>
                                <Text
                                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                    className="text-xs uppercase tracking-widest text-gray-400 mt-2"
                                >
                                    Member
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* Settings Menu */}
                    <View className="space-y-6">
                        {/* Account Settings */}
                        <View>
                            <Text
                                style={{ fontFamily: 'PlusJakartaSans-Black' }}
                                className="text-xs uppercase tracking-[0.2em] text-gray-400 px-2 mb-3"
                            >
                                Account Settings
                            </Text>
                            <View className="bg-[#F9F9F9] rounded-[24px] overflow-hidden">
                                <MenuItem
                                    icon={User}
                                    label="Personal Information"
                                    onPress={() => setShowEditProfileModal(true)}
                                />
                                <MenuItem
                                    icon={Utensils}
                                    label="Dietary Preferences"
                                    last
                                />
                            </View>
                        </View>

                        {/* Support & Feedback */}
                        <View>
                            <Text
                                style={{ fontFamily: 'PlusJakartaSans-Black' }}
                                className="text-xs uppercase tracking-[0.2em] text-gray-400 px-2 mb-3"
                            >
                                Support & Feedback
                            </Text>
                            <View className="bg-[#F9F9F9] rounded-[24px] overflow-hidden">
                                <MenuItem
                                    icon={HelpCircle}
                                    label="Help Center"
                                />
                                <MenuItem
                                    icon={MessageSquare}
                                    label="Give Feedback"
                                    last
                                />
                            </View>
                        </View>
                    </View>

                    {/* Sign Out Action */}
                    <TouchableOpacity
                        onPress={handleSignOut}
                        className="w-full flex-row items-center justify-center gap-2 py-4 rounded-3xl bg-[#C24F5C]/5 active:scale-[0.98]"
                    // bg-destructive/5
                    >
                        <LogOut size={20} color={COLORS.destructive} strokeWidth={2.5} />
                        <Text
                            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                            className="text-[#C24F5C] text-base"
                        >
                            Sign Out
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <AuthModal
                isVisible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
            <EditProfileModal
                isVisible={showEditProfileModal}
                onClose={() => setShowEditProfileModal(false)}
            />
        </View>
    );
}
