import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { point, lineString } from '@turf/helpers';
import turfCircle from '@turf/circle';
import { useTracking } from '@/firebase/tracking-context';
import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default function MapboxNative() {
    const { farmCenterCoordinates, farmRadius, sensorsFeeds } = useTracking();
    const cameraRef = useRef<MapboxGL.Camera>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [traceIdx, setTraceIdx] = useState(0);
    const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);

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

    // Handler for cow icon click
    const handleCowClick = () => {
        if (!sensorsFeeds.length) return;
        const idx = currentIdx % sensorsFeeds.length;
        const feed = sensorsFeeds[idx];
        cameraRef.current?.flyTo([feed.longitude, feed.latitude], 1000);
        setTimeout(() => {
            cameraRef.current?.zoomTo(15, 500);
        }, 1000); // Wait for flyTo to finish before zooming
        setRouteGeoJSON(null); // Clear route
        setCurrentIdx((prev) => (prev + 1) % sensorsFeeds.length);
    };

    // Handler for farm/geofence icon click
    const handleFarmClick = () => {
        cameraRef.current?.flyTo(centerCoords, 1000);
        setTimeout(() => {
            cameraRef.current?.zoomTo(15, 500);
        }, 1000); // Wait for flyTo to finish before zooming
        setRouteGeoJSON(null); // Clear route
    };

    // Handler for trace route button
    const handleTraceRoute = () => {
        if (!sensorsFeeds.length) return;
        const idx = traceIdx % sensorsFeeds.length;
        const feed = sensorsFeeds[idx];

        // Create a GeoJSON LineString from farm center to collar
        const route = lineString([
            centerCoords,
            [feed.longitude, feed.latitude],
        ]);
        setRouteGeoJSON(route);

        // Optionally fit camera to show the route
        cameraRef.current?.fitBounds(
            centerCoords,
            [feed.longitude, feed.latitude],
            100,
            1000
        );
        setTraceIdx((prev) => (prev + 1) % sensorsFeeds.length);
    };

    return (
        <View style={styles.container}>
            {/* Cow icon button */}
            <TouchableOpacity
                className="absolute bottom-[136px] w-12 h-12 right-2 z-10 bg-white rounded-full p-1.5 shadow"
                onPress={handleCowClick}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons name="cow" size={32} color="#1e3a8a" />
            </TouchableOpacity>
            {/* Farm/geofence icon button just below cow icon */}
            <TouchableOpacity
                className="absolute flex justify-center items-center bottom-[80px] w-12 h-12 right-2 z-10 bg-red-500 rounded-full p-1.5 shadow"
                onPress={handleFarmClick}
                activeOpacity={0.7}
            >
                <Fontisto name="island" size={28} color="#fff" />
            </TouchableOpacity>
            {/* Trace route button just below farm icon */}
            <TouchableOpacity
                className="absolute flex justify-center items-center bottom-[24px] w-12 h-12 right-2 z-10 bg-blue-500 rounded-full p-1.5 shadow"
                onPress={handleTraceRoute}
                activeOpacity={0.7}
            >
                <FontAwesome6 name="route" size={24} color="#fff" />
            </TouchableOpacity>

            <MapboxGL.MapView
                style={styles.container}
                styleURL={MapboxGL.StyleURL.Street}
                logoEnabled={false}
                compassEnabled={true}
            >
                <MapboxGL.Camera
                    ref={cameraRef}
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
                        <MaterialCommunityIcons
                            name="map-marker"
                            size={38}
                            color="#E53935"
                            style={{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 19,
                                overflow: 'hidden',
                            }}
                        />
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

                {/* Route Line */}
                {routeGeoJSON && (
                    <MapboxGL.ShapeSource id="route" shape={routeGeoJSON}>
                        <MapboxGL.LineLayer
                            id="route-line"
                            style={{
                                lineColor: '#1e3a8a',
                                lineWidth: 4,
                                lineDasharray: [2, 2],
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}
            </MapboxGL.MapView>
        </View>
    );
}
