import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import signUpIcon from '@/assets/images/GroupB.png'; // Your image from assets

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        // Add your sign up logic here
        router.push("/(tabs)");
    };

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <View className="bg-white h-full w-full">
            {/* Image Header */}
            <View className="w-full">
                <Image 
                    source={signUpIcon} 
                    className="pb-2 object-contain relative w-full"
                    style={{ resizeMode: "cover"}}
                />
            </View>

            {/* Sign Up Form */}
            <View className="px-8 w-full mt-20">
                
                {/* Full Name Input */}
                <View className="w-full mb-4">
                    <Text className="text-gray-600 mb-2">Enter FullName</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Full name"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>
                
                {/* Phone Number Input */}
                <View className="w-full mb-4">
                    <Text className="text-gray-600 mb-2">Enter Phone Number</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
                
                {/* Password Input */}
                <View className="w-full mb-4">
                    <Text className="text-gray-600 mb-2">Enter password</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                
                {/* Confirm Password Input */}
                <View className="w-full mb-8">
                    <Text className="text-gray-600 mb-2">Confirm password</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Confirm password"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                
                {/* Sign Up Button */}
                <TouchableOpacity 
                    className="w-full bg-blue-500 py-3 rounded-lg mb-6"
                    onPress={handleSignUp}
                >
                    <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
                </TouchableOpacity>
                
                {/* Login Link */}
                <View className="flex flex-row justify-center">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text className="text-blue-500 font-semibold">Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}