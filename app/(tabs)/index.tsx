import Avatar from '@/components/ui/avatar';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View, TextInput, TouchableOpacity } from 'react-native';
import verificationIcon from '@/assets/images/icon.png';
import bars from '@/assets/images/bars.png';
import { Ionicons } from '@expo/vector-icons';
import MapboxWeb from '@/components/ui/maps';

export default function HomeScreen() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Avatar
                    imgSrc={verificationIcon}
                    containerClassName="rounded-full ml-3 border border-black/20"
                    className="w-12 h-12 rounded-full"
                />
            ),
            headerTitle: () => (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-lg text-white">Shyaka Claude</Text>
                    <Text className="text-xs text-gray-300">Kigali, Bweramvura</Text>
                </View>
            ),
            headerRight: () => <Image source={bars} className="w-10 h-10 mr-3" />,
            headerTitleAlign: "center",
            headerShadowVisible: true,
            headerStyle: {
                backgroundColor: '#103060',
            },
        });
    }, [navigation]);

    return (
        <View className="flex-1">
            {/* Search Bar */}
            <View className="absolute w-full top-3 px-4 pt-3 pb-2 z-10">
                <View className="flex-row items-center bg-white rounded-lg shadow px-2">
                    <Ionicons name="location-outline" size={22} color="#103060" className="mr-2" />
                    <TextInput
                        className="flex-1 py-2 px-2 text-gray-800"
                        placeholder="Shakisha ahantu."
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity className="p-2">
                        <Ionicons name="search" size={22} color="#103060" />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Map */}
            <View className="flex-1 relative">
                {/* Mapbox Web Component */}
                <MapboxWeb />
            </View>
        </View>
    );
}