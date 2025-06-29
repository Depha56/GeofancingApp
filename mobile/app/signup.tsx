import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useAuth } from '@/firebase/auth-context';
import Header from '@/components/layout/header';
import signUpIcon from '@/assets/images/signin_img.png';

export default function SignUpScreen() {
    const router = useRouter();
    const { register, loading, error } = useAuth();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleSignUp = async () => {
        setLocalError(null);
        if (!email || !password || !confirmPassword || !fullName) {
            setLocalError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }
            
        const user =await register(email, password, fullName, phoneNumber);
        if(user?.user) router.push("/(tabs)");
    };

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <ScrollView className="bg-white h-full w-full">
            <Header
                icon={ signUpIcon }
                title="Sign Up"
            />

            {/* Sign Up Form */}
            <View className="px-8 w-full mt-10">
                {/* Full Name Input */}
                <View className="w-full mb-4">
                    <Text className="text-gray-600 mb-2">Enter Full Name</Text>
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
                {/* Email Input */}
                <View className="w-full mb-4">
                    <Text className="text-gray-600 mb-2">Enter Email</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
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
                {/* Error Message */}
                {(localError || error) && (
                    <Text className="text-red-500 mb-4 text-center">{localError || error}</Text>
                )}
                {/* Sign Up Button */}
                <TouchableOpacity 
                    className="w-full bg-primary py-3 rounded-lg mb-6 flex items-center justify-center"
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
                    )}
                </TouchableOpacity>
                {/* Login Link */}
                <View className="flex mb-3 flex-row justify-center">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text className="text-primary font-semibold">Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}