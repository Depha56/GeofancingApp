import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter} from 'expo-router';
import signInIcon from '@/assets/images/header.png'; // Your image from assets

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const handleLogin = () => {
        // Add your login logic here
        router.push("/(tabs)");
    };

    const handleSignUp = () => {
        router.push("/signup");
    };

    return (
        <View className="bg-white h-full w-full">
            {/* Image Header */}
            <View className="w-full items-center justify-center ">
                <Image 
                    source={ signInIcon } 
                    className="w-full  object-contain"
                />
            </View>

            {/* Login Form */}
            <View className="px-8 w-full">
                
                {/* Phone Number Input */}
                <View className="w-full">
                    <Text className="text-gray-600 ">Enter Phone Number</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
                
                {/* Password Input */}
                <View className="w-full mb-6 mt-3">
                    <Text className="text-gray-600 mb-2">Enter password</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                
                {/* Remember Me Checkbox */}
                <View className="w-full flex flex-row items-center mb-8">
                    <TouchableOpacity 
                        className="w-5 h-5 border border-gray-400 rounded mr-2 flex items-center justify-center"
                        onPress={() => setKeepLoggedIn(!keepLoggedIn)}
                    >
                        {keepLoggedIn && (
                            <View className="w-3 h-3 bg-blue-500 rounded-sm" />
                        )}
                    </TouchableOpacity>
                    <Text className="text-gray-600">Keep me logged in.</Text>
                </View>
                
                {/* Login Button */}
                <TouchableOpacity 
                    className="w-full bg-blue-500 py-3 rounded-lg mb-6"
                    onPress={handleLogin}
                >
                    <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
                </TouchableOpacity>
                
                {/* Sign Up Link */}
                <View className="flex flex-row justify-center">
                    <Text className="text-gray-600">Don't have an account yet? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text className="text-blue-500 font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}