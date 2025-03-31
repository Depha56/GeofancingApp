import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { routeImg } from '@/assets';
import { useNavigation } from 'expo-router';

export default function SplashScreen() {
    const navigation = useNavigation();
    
    const handleGetStarted = () => {
        navigation.navigate("(tabs)" as never);
    }

    return (
        <View className="bg-primary h-full w-full flex items-center justify-center px-3">
            <Image source={ routeImg } className="w-40 h-36 object-contain"/>
            <Text className="text-3xl text-white font-bold mt-3">Keep your cows safe with us</Text>
            <Text className="text-center mt-3 text-lg text-white">Get real-time tracking, instant alerts, and AI-powered security—all in one smart geofencing app. Protect your farm, prevent losses, and monitor your livestock anytime, anywhere.</Text>
            <TouchableOpacity 
                className="mt-10 px-6 py-3 rounded-3xl border border-[#99b8e6]"
                onPress= { handleGetStarted }
            >
                <Text className="text-white text-lg font-semibold">Get Started</Text>
            </TouchableOpacity>
        </View>
        );
}