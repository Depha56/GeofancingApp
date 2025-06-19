import { homeOptions } from '@/components/common/home-nav-options';
import { useAuth, fetchUsersByFarmId } from '@/firebase/auth-context';
import { useTracking } from '@/firebase/tracking-context';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';

export default function Settings() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user } = useAuth();
    const { farmId, farmRadius, farmCenterCoordinates, collarIds, setFarmData } = useTracking();

    const [managers, setManagers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state for Add Collar
    const [addCollarModal, setAddCollarModal] = useState(false);
    const [newCollarId, setNewCollarId] = useState('');
    const [addingCollar, setAddingCollar] = useState(false);

    useEffect(() => {
        navigation.setOptions(homeOptions(user, setMenuVisible, menuVisible));
    }, [navigation, menuVisible, user]);

    // Fetch managers (users with the same farmId)
    useEffect(() => {
        const fetchManagers = async () => {
            if (farmId) {
                setLoading(true);
                const users = await fetchUsersByFarmId(farmId);
                setManagers(users);
                setLoading(false);
            }
        };
        fetchManagers();
    }, [farmId]);

    // Farm summary info from context
    const farmSummary = {
        farmId: user?.farmId || 'N/A',
        radius: farmRadius ? `${farmRadius}m` : 'N/A',
        center: farmCenterCoordinates
            ? `Lat: ${farmCenterCoordinates.latitude}, Lng: ${farmCenterCoordinates.longitude}`
            : 'N/A',
        totalLivestock: collarIds.length,
    };

    // Handle Add Collar
    const handleAddCollar = async () => {
        if (!newCollarId.trim()) {
            Alert.alert('Validation', 'Please enter a collar ID');
            return;
        }
        setAddingCollar(true);
        try {
            await setFarmData(
                farmRadius!,
                farmCenterCoordinates!,
                [...collarIds, newCollarId.trim()],
                user
            );
            setNewCollarId('');
            setAddCollarModal(false);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to add collar');
        }
        setAddingCollar(false);
    };

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Farm Summary Card */}
            <View className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <Text className="text-xl font-semibold text-gray-800 mb-3">Farm Summary</Text>
                <View className="space-y-1.5">
                    <Text className="text-base text-gray-700">Farm ID: <Text className="font-medium">{farmSummary.farmId}</Text></Text>
                    <Text className="text-base mt-1 text-gray-700">Farm Radius: <Text className="font-medium">{farmSummary.radius}</Text></Text>
                    <Text className="text-base mt-1 text-gray-700">Farm Center: <Text className="font-medium">{farmSummary.center}</Text></Text>
                    <Text className="text-base mt-1 text-gray-700">Total Livestock: <Text className="font-medium">{farmSummary.totalLivestock}</Text></Text>
                </View>
                {/* Edit Farm Button */}
                <View className="flex-row justify-end gap-x-2 mt-4">
                    <TouchableOpacity
                        className="bg-green-600 px-4 py-2 rounded-lg active:opacity-80"
                        onPress={() => setAddCollarModal(true)}
                    >
                        <Text className="text-white text-sm font-semibold">Add Collar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-blue-600 px-4 py-2 rounded-lg active:opacity-80"
                        onPress={() => {
                            // Add your edit farm navigation or logic here
                        }}
                    >
                        <Text className="text-white text-sm font-semibold">Edit Farm</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add Collar Modal */}
            <Modal
                visible={addCollarModal}
                transparent
                animationType="slide"
                onRequestClose={() => setAddCollarModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-xl p-6 w-11/12 max-w-md">
                        <Text className="text-lg font-semibold mb-4">Add New Collar</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                            placeholder="Enter Collar ID"
                            value={newCollarId}
                            onChangeText={setNewCollarId}
                        />
                        <View className="flex-row justify-end gap-x-2">
                            <TouchableOpacity
                                className="px-4 py-2 rounded-lg bg-gray-200"
                                onPress={() => setAddCollarModal(false)}
                                disabled={addingCollar}
                            >
                                <Text className="text-gray-700 font-semibold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-4 py-2 rounded-lg bg-green-600"
                                onPress={handleAddCollar}
                                disabled={addingCollar}
                            >
                                <Text className="text-white font-semibold">
                                    {addingCollar ? 'Adding...' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Managers List Card */}
            <View className="bg-white rounded-2xl shadow-sm p-4">
                <Text className="text-xl font-semibold text-gray-800 mb-3">Farm Managers</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#103060" />
                ) : (
                    <FlatList
                        data={managers}
                        keyExtractor={item => item.uid}
                        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
                        renderItem={({ item }) => (
                            <View className="flex-row items-center justify-between py-3">
                                <View className="flex-1 mr-4">
                                    <Text className="text-base text-gray-800">{item.fullName || item.email}</Text>
                                    <Text className="text-sm text-gray-500">{item.email}</Text>
                                </View>
                                {user?.uid !== item.uid && (
                                    <TouchableOpacity className="bg-red-500 px-4 py-2 rounded-lg active:opacity-80">
                                        <Text className="text-white text-sm font-semibold">Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}
