import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useRouter } from 'expo-router';
import turfCircle from '@turf/circle';
import { featureCollection, point } from '@turf/helpers';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { Ionicons } from '@expo/vector-icons';
import { useTracking } from '@/firebase/tracking-context';
import { useAuth } from '@/firebase/auth-context';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locateButton: {
    position: 'absolute',
    top: 70,
    right: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    zIndex: 10,
  },
  marker: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default function GeofenceSetupScreen() {
  const router = useRouter();
  const { setFarmData } = useTracking();
  const { user } = useAuth();

  const [center, setCenter] = useState<[number, number]>([30.1127, -1.9577]);
  const [radius, setRadius] = useState<number>(200);
  const [collarId, setCollarId] = useState<string>('');
  const [geojson, setGeojson] = useState<any>(() => generateCircle([30.1127, -1.9577], 300));

  function generateCircle(center: [number, number], radius: number) {
    const circle = turfCircle(point(center), radius / 1000, {
      steps: 64,
      units: 'kilometers',
    });
    return featureCollection([circle]);
  }

  useEffect(() => {
    const checkPermissions = async () => {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status !== RESULTS.GRANTED) {
        const requestStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (requestStatus !== RESULTS.GRANTED) {
          Alert.alert('Location Permission Required', 'Please enable location permissions to use this feature.');
        }
      }
    };

    checkPermissions();
  }, []);

  const centerOnUserLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location permission is required');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter: [number, number] = [longitude, latitude];
          setCenter(newCenter);
          setGeojson(generateCircle(newCenter, radius));
        },
        (error) => {
          Alert.alert('Error', 'Could not fetch location');
          console.error(error);
        },
        { enableHighAccuracy: true }
      );
    } catch (err) {
      console.error('Permission error', err);
    }
  };

  const onDragEnd = (e: any) => {
    const coords = e.geometry.coordinates;
    setCenter(coords);
    setGeojson(generateCircle(coords, radius));
  };

  const handleRadiusChange = (val: string) => {
    const parsed = parseInt(val) || 0;
    setRadius(parsed);
    setGeojson(generateCircle(center, parsed));
  };

  const handleContinue = async () => {
    if (!collarId) {
      Alert.alert('Validation', 'Please enter a collar ID');
      return;
    }
    try {
      await setFarmData(
        radius,
        { latitude: center[1], longitude: center[0] },
        [collarId],
        user
      );
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Failed to save farm data');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        compassEnabled={true}
        onPress={(e) => {
          const coords = (e.geometry as any).coordinates;
          setCenter(coords);
          setGeojson(generateCircle(coords, radius));
        }}
      >
        <MapboxGL.Camera centerCoordinate={center} zoomLevel={15} />

        <MapboxGL.LocationPuck visible={true} />

        <MapboxGL.PointAnnotation
          id="marker"
          coordinate={center}
          draggable
          onDragEnd={onDragEnd}
        >
          <View style={styles.marker} />
        </MapboxGL.PointAnnotation>

        <MapboxGL.ShapeSource id="circle" shape={geojson}>
          <MapboxGL.FillLayer
            id="circle-fill"
            style={{ fillColor: 'red', fillOpacity: 0.2 }}
          />
          <MapboxGL.LineLayer
            id="circle-outline"
            style={{ lineColor: 'red', lineWidth: 2 }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <TouchableOpacity style={styles.locateButton} onPress={centerOnUserLocation}>
        <Ionicons name="locate-outline" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.label}>Animal or Collar ID</Text>
        <TextInput
          value={collarId}
          onChangeText={setCollarId}
          placeholder="e.g. Cow123"
          style={styles.input}
        />

        <Text style={styles.label}>Fence Radius (meters)</Text>
        <TextInput
          value={radius.toString()}
          onChangeText={handleRadiusChange}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button title="Continue to Tracking" onPress={handleContinue} />
      </View>
    </View>
  );
}
