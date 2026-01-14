import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface LocationPromptProps {
    onAccept: () => void;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({ onAccept }) => {
    return (
        <View className="flex-1 items-center justify-center p-8 bg-white">
            <View className="bg-primary/10 p-6 rounded-full mb-6">
                <MapPin size={48} color="#FF4B2B" />
            </View>

            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                Find Tasty Spots Nearby
            </Text>

            <Text className="text-base text-gray-500 text-center mb-10">
                BiteMatch needs your location to show you the best restaurants right in your neighborhood.
            </Text>

            <TouchableOpacity
                onPress={onAccept}
                className="bg-primary w-full py-4 rounded-2xl shadow-lg shadow-primary/20"
            >
                <Text className="text-white text-center font-bold text-lg">
                    Enable Location
                </Text>
            </TouchableOpacity>
        </View>
    );
};
