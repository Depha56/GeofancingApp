import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useAuth } from '@/firebase/auth-context';
import Header from '@/components/layout/header';
import signinIcon from '@/assets/images/signin_img.png';

export default function LoginScreen() {
    const router = useRouter();
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleLogin = async () => {
        setLocalError(null);
        if (!email || !password) {
            setLocalError("Email and password are required.");
            return;
        }
        
        const user = await login(email, password);
        if(user?.user) router.push("/(tabs)");

    };

    const handleSignUp = () => {
        router.push("/signup");
    };

    return (
        <ScrollView className="bg-white h-full w-full">
            <Header
                icon={ signinIcon }
                title="Login"
            />

            {/* Login Form */}
            <View className="px-8 w-full">
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
                <View className="w-full mb-6">
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
                {/* Error Message */}
                {(localError || error) && (
                    <Text className="text-red-500 mb-4 text-center">{localError || error}</Text>
                )}
                {/* Login Button */}
                <TouchableOpacity 
                    className="w-full bg-primary py-3 rounded-lg mb-6 flex items-center justify-center"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
                    )}
                </TouchableOpacity>
                {/* Sign Up Link */}
                <View className="flex flex-row mb-2 justify-center">
                    <Text className="text-gray-600">Don't have an account yet? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text className="text-primary font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}