import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker, MapPressEvent } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';
type RootStackParamList = {
    TrackingScreen: {
        center: [number, number];
        radius: number;
        collarId: string;
    };
};



export default function GeofenceSetupScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [radius, setRadius] = useState<number>(300);
    const [collarId, setCollarId] = useState<string>('');
    // Removed unused center state
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleRadiusChange = (val: string) => {
        const parsed = parseInt(val) || 0;
        setRadius(parsed);
    };

    const handleContinue = () => {
        if (!collarId) {
            alert('Please enter a collar ID');
            return;
        }
        if (!selectedLocation) {
            alert('Please select a location on the map or use your current location');
            return;
        }
        navigation.navigate('TrackingScreen', {
            center: [selectedLocation.latitude, selectedLocation.longitude],
            radius,
            collarId
        });
    };

    const handleGetCurrentLocation = async () => {
        setLoading(true);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                "Permission denied",
                "Permission to access location was denied"
                );
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = currentLocation.coords;
            setSelectedLocation({ latitude, longitude });
            Alert.alert("Success", "Current location detected");
        } catch (error) {
            console.error("Error getting location:", error);
            Alert.alert("Error", "Failed to get your current location");
        } finally {
            setLoading(false);
        }
  };

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

    return (
        <View className="flex-1 bg-white">
            <TouchableOpacity
                className="flex flex-row items-center gap-2 bg-white border rounded-xl border-grey/20 p-3 mb-3"
                onPress={handleGetCurrentLocation}
                disabled={loading}
            >
                <Ionicons name="locate" size={20} color="#E02323" />
                <Text> {loading ? "Getting your location..." : "Use my current location"} </Text>
            </TouchableOpacity>

            <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={{
                    latitude: selectedLocation ? selectedLocation.latitude : 30.1127,
                    longitude: selectedLocation ? selectedLocation.longitude : -1.9577,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                    }}
                    onPress={handleMapPress}
            >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
            </MapView>
            <View className="p-4 bg-white">
                <Text className="font-bold text-sm mb-1">Animal or Collar ID</Text>
                <TextInput
                    value={collarId}
                    onChangeText={setCollarId}
                    placeholder="e.g. Cow123"
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                />
                <Text className="font-bold text-sm mb-1">Fence Radius (meters)</Text>
                <TextInput
                    value={radius.toString()}
                    onChangeText={handleRadiusChange}
                    keyboardType="numeric"
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                />
                <Button title="Continue to Tracking" onPress={handleContinue} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
