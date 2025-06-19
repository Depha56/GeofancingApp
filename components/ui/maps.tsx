import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { point } from '@turf/helpers';
import turfCircle from '@turf/circle';
import { useTracking } from '@/firebase/tracking-context';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E53935',
    borderColor: '#fff',
    borderWidth: 2,
  },
});

export default function MapboxNative() {
  const { farmCenterCoordinates, farmRadius, sensorsFeeds } = useTracking();
    
  // Default center if not set
  const centerCoords: [number, number] = farmCenterCoordinates
    ? [farmCenterCoordinates.longitude, farmCenterCoordinates.latitude]
    : [30.1127, -1.9577];

  const radius = farmRadius || 200;

  // Draw geofence circle
  const fenceGeoJSON = turfCircle(point(centerCoords), radius / 1000, {
    steps: 64,
    units: 'kilometers',
  });

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.container}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        compassEnabled={true}
      >
        <MapboxGL.Camera
          centerCoordinate={centerCoords}
          zoomLevel={15}
        />

        {/* Animal/collar markers */}
        {sensorsFeeds.map(feed => (
          <MapboxGL.PointAnnotation
            key={feed.collarId}
            id={feed.collarId}
            coordinate={[feed.longitude, feed.latitude]}
          >
            <View style={styles.marker} />
            <MapboxGL.Callout title={feed.collarId} />
          </MapboxGL.PointAnnotation>
        ))}

        {/* Geofence Circle */}
        <MapboxGL.ShapeSource id="geofence" shape={fenceGeoJSON}>
          <MapboxGL.FillLayer
            id="geofence-fill"
            style={{
              fillColor: '#E53935',
              fillOpacity: 0.2,
            }}
          />
          <MapboxGL.LineLayer
            id="geofence-outline"
            style={{
              lineColor: '#E53935',
              lineWidth: 2,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </View>
  );
}
