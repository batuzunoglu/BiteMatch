
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X, User, Image as ImageIcon, Save } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EditProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isVisible, onClose }) => {
    const { user, updateUserProfile } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || '');
        }
    }, [user, isVisible]);

    if (!isVisible) return null;

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateUserProfile(displayName, photoURL);
            onClose();
        } catch (error) {
            // Error handled in hook
        } finally {
            setLoading(false);
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <View style={StyleSheet.absoluteFill} className="z-50 justify-center">
            {/* Dark Backdrop */}
            <Animated.View
                entering={FadeIn}
                style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-5"
            >
                <Animated.View
                    entering={SlideInDown.springify().damping(20)}
                    className="bg-white rounded-[30px] px-8 pt-10 pb-10"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 20 },
                        shadowOpacity: 0.25,
                        shadowRadius: 25,
                        elevation: 10
                    }}
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <View>
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-3xl text-gray-900">
                                Edit Profile
                            </Text>
                            <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-400 mt-1">
                                Update your personal details
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                        >
                            <X size={20} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    {/* Inputs */}
                    <View className="mb-8">
                        <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center border border-[#EEEEEE] mb-6">
                            <User size={20} color="#A0A0A0" strokeWidth={2} />
                            <TextInput
                                placeholder="Display Name"
                                value={displayName}
                                onChangeText={setDisplayName}
                                className="flex-1 ml-3 text-gray-900"
                                placeholderTextColor="#A0A0A0"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            />
                        </View>
                        <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center border border-[#EEEEEE]">
                            <ImageIcon size={20} color="#A0A0A0" strokeWidth={2} />
                            <TextInput
                                placeholder="Photo URL"
                                value={photoURL}
                                onChangeText={setPhotoURL}
                                className="flex-1 ml-3 text-gray-900"
                                placeholderTextColor="#A0A0A0"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        <LinearGradient
                            colors={['#FF583D', '#FF8162']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="rounded-2xl h-16 items-center justify-center flex-row shadow-lg shadow-orange-200"
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-white text-lg mr-2">
                                        Save Changes
                                    </Text>
                                    <Save size={20} color="#FFF" strokeWidth={2.5} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
};
