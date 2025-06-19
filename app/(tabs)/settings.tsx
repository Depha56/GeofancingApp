import { homeOptions } from '@/components/common/home-nav-options';
import { useAuth } from '@/firebase/auth-context';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const farmSummary = {
    ownerId: '123456',
    radius: '500m',
    center: 'Lat: -1.2921, Lng: 36.8219',
    totalLivestock: 120,
};

const managers = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com' },
];

export default function Settings() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        navigation.setOptions(homeOptions(user, setMenuVisible, menuVisible));
    }, [navigation, menuVisible, user]);

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Farm Summary Card */}
            <View className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <Text className="text-xl font-semibold text-gray-800 mb-3">Farm Summary</Text>
                <View className="space-y-1.5">
                    <Text className="text-sm text-gray-700">Farm Owner ID: <Text className="font-medium">{farmSummary.ownerId}</Text></Text>
                    <Text className="text-sm text-gray-700">Farm Radius: <Text className="font-medium">{farmSummary.radius}</Text></Text>
                    <Text className="text-sm text-gray-700">Farm Center: <Text className="font-medium">{farmSummary.center}</Text></Text>
                    <Text className="text-sm text-gray-700">Total Livestock: <Text className="font-medium">{farmSummary.totalLivestock}</Text></Text>
                </View>
            </View>

            {/* Managers List Card */}
            <View className="bg-white rounded-2xl shadow-sm p-4">
                <Text className="text-xl font-semibold text-gray-800 mb-3">Farm Managers</Text>
                <FlatList
                    data={managers}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center justify-between py-3">
                            <View className="flex-1 mr-4">
                                <Text className="text-base text-gray-800">{item.name}</Text>
                                <Text className="text-sm text-gray-500">{item.email}</Text>
                            </View>
                            <TouchableOpacity className="bg-red-500 px-4 py-2 rounded-lg active:opacity-80">
                                <Text className="text-white text-sm font-semibold">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
