import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Mail, Lock, Chrome, Apple, ArrowRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import * as AppleAuthentication from 'expo-apple-authentication';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AuthModalProps {
    isVisible: boolean;
    onClose: () => void;
    initialView?: 'login' | 'signup';
}

import { useAuth } from '../hooks/useAuth';

export const AuthModal: React.FC<AuthModalProps> = ({ isVisible, onClose, initialView = 'login' }) => {
    const { signIn, signUp, signInWithGoogle, signInWithApple, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(initialView === 'login');
    const [isAppleAvailable, setIsAppleAvailable] = useState(false);

    // Update state when modal visibility or initialView changes
    useEffect(() => {
        if (isVisible) {
            setIsLogin(initialView === 'login');
            setIsReset(false);
            setEmail('');
            setPassword('');
        }
    }, [isVisible, initialView]);

    useEffect(() => {
        AppleAuthentication.isAvailableAsync().then(setIsAppleAvailable);
    }, []);

    const [isReset, setIsReset] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isVisible) return null;

    const handleAuth = async () => {
        if (!email) return;
        if (!isReset && !password) return;

        setLoading(true);
        try {
            if (isReset) {
                await resetPassword(email);
                setIsReset(false);
                setIsLogin(true);
            } else if (isLogin) {
                await signIn(email, password);
                onClose();
            } else {
                await signUp(email, password);
                onClose();
            }
        } catch (error) {
            // Error is handled by Toast in useAuth
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
        } catch (error) {
            // Handled
        } finally {
            setLoading(false);
        }
    };

    const handleAppleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithApple();
            onClose();
        } catch (error) {
            // Handled
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={StyleSheet.absoluteFill} className="z-50">
            <Animated.View
                entering={FadeIn}
                style={StyleSheet.absoluteFill}
            >
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                <TouchableOpacity
                    activeOpacity={1}
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-end"
            >
                <Animated.View
                    entering={SlideInDown.springify().damping(20)}
                    className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl"
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <View>
                            <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-3xl text-gray-900">
                                {isReset ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
                            </Text>
                            <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-400 mt-1">
                                {isReset ? 'Enter email to receive reset link' : (isLogin ? 'Sign in to continue discovery' : 'Join BiteMatch and find food')}
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
                    <View className="space-y-4 mb-8">
                        <View className="bg-gray-50 rounded-2xl px-5 py-4 flex-row items-center border border-gray-100 mb-4">
                            <Mail size={20} color="#A0A0A0" strokeWidth={2} />
                            <TextInput
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                className="flex-1 ml-3 text-gray-900"
                                placeholderTextColor="#A0A0A0"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            />
                        </View>
                        {!isReset && (
                            <View className="bg-gray-50 rounded-2xl px-5 py-4 flex-row items-center border border-gray-100 mb-4">
                                <Lock size={20} color="#A0A0A0" strokeWidth={2} />
                                <TextInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    className="flex-1 ml-3 text-gray-900"
                                    placeholderTextColor="#A0A0A0"
                                    secureTextEntry
                                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                />
                            </View>
                        )}

                        {isLogin && !isReset && (
                            <TouchableOpacity onPress={() => setIsReset(true)} className="self-end mb-2">
                                <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-400 text-sm">
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity onPress={handleAuth} disabled={loading}>
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
                                        {isReset ? 'Send Link' : (isLogin ? 'Sign In' : 'Get Started')}
                                    </Text>
                                    <ArrowRight size={20} color="#FFF" strokeWidth={2.5} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-gray-100" />
                        <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="text-gray-300 mx-4 text-xs font-bold uppercase tracking-widest">
                            Or continue with
                        </Text>
                        <View className="flex-1 h-[1px] bg-gray-100" />
                    </View>

                    {/* Social Buttons */}
                    <View className="flex-row space-x-4 mb-8">
                        <TouchableOpacity
                            onPress={handleGoogleSignIn}
                            className="flex-1 h-14 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-center flex-row mr-2"
                        >
                            <Chrome size={20} color="#1A1A1A" strokeWidth={2} />
                            <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="ml-2 text-gray-900">Google</Text>
                        </TouchableOpacity>
                        {isAppleAvailable && (
                            <TouchableOpacity
                                onPress={handleAppleSignIn}
                                className="flex-1 h-14 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-center flex-row ml-2"
                            >
                                <Apple size={20} color="#1A1A1A" strokeWidth={2} fill="#1A1A1A" />
                                <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }} className="ml-2 text-gray-900">Apple</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Footer Toggle */}
                    <TouchableOpacity
                        onPress={() => {
                            if (isReset) {
                                setIsReset(false);
                                setIsLogin(true);
                            } else {
                                setIsLogin(!isLogin);
                            }
                        }}
                        className="items-center"
                    >
                        <Text style={{ fontFamily: 'PlusJakartaSans-Medium' }} className="text-gray-400">
                            {isReset ? (
                                <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-[#FF583D]">
                                    Back to Sign In
                                </Text>
                            ) : (
                                <>
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }} className="text-[#FF583D]">
                                        {isLogin ? 'Sign Up' : 'Sign In'}
                                    </Text>
                                </>
                            )}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
};
