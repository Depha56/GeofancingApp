import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, KeyboardAvoidingView, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useNavigation, NavigationProp } from '@react-navigation/native';

MapboxGL.setAccessToken('pk.eyJ1Ijoic2F2ZXVyMSIsImEiOiJjbGhqNjRhNHQwMDBnM2VvcDlkZnIyYjI0In0.mivybJHy1tDykpetIB-_nw');

type RootStackParamList = {
  TrackingScreen: {
    center: [number, number];
    radius: number;
    collarId: string;
  };
};

export default function GeofenceSetupScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [center, setCenter] = useState<[number, number]>([30.1127, -1.9577]);
  const [radius, setRadius] = useState<number>(300);
  const [collarId, setCollarId] = useState<string>('');
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const generateCircle = (center: [number, number], radius: number) => {
    const points = 64;
    const coords = [];
    const R = 6378137;

    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const dx = radius * Math.cos((angle * Math.PI) / 180);
      const dy = radius * Math.sin((angle * Math.PI) / 180);
      const lng = center[0] + (dx / (R * Math.cos((Math.PI * center[1]) / 180))) * (180 / Math.PI);
      const lat = center[1] + (dy / R) * (180 / Math.PI);
      coords.push([lng, lat]);
    }
    coords.push(coords[0]);
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords],
      },
    };
  };

  const handleMarkerDragEnd = (e: any) => {
    const { coordinates } = e.geometry;
    setCenter(coordinates);
  };

  const handleContinue = () => {
    if (!collarId) {
      alert('Please enter a collar ID');
      return;
    }
    navigation.navigate('TrackingScreen', {
      center,
      radius,
      collarId,
    });
  };

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1">
        <MapboxGL.MapView style={{ flex: 1 }} styleURL={MapboxGL.StyleURL.Street}>
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={15}
            centerCoordinate={center}
          />

          {/* Geofence circle */}
          <MapboxGL.ShapeSource id="geofence" shape={generateCircle(center, radius)}>
            <MapboxGL.FillLayer
              id="circleFill"
              style={{ fillColor: '#FF0000', fillOpacity: 0.2 }}
            />
            <MapboxGL.LineLayer
              id="circleStroke"
              style={{ lineColor: '#FF0000', lineWidth: 2 }}
            />
          </MapboxGL.ShapeSource>

          {/* Draggable Marker */}
          <MapboxGL.PointAnnotation
            id="marker"
            coordinate={center}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </MapboxGL.MapView>
      </View>

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
          onChangeText={(text) => setRadius(parseInt(text) || 0)}
          keyboardType="numeric"
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <Button title="Continue to Tracking" onPress={handleContinue} />
      </View>
    </KeyboardAvoidingView>
  );
}
