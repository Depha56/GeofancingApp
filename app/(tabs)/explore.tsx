// import { View, Text } from 'react-native';

// export default function TabTwoScreen() {
//   return (
//     <View>
//         <Text>Explore</Text>
//     </View>
//   );
// }

import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export default function GeofenceSetupScreen() {
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  const [radius, setRadius] = useState(300);
  const [collarId, setCollarId] = useState('');
  const [center, setCenter] = useState([30.1127, -1.9577]);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no"/>
      <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
      <style>
        body, html { margin: 0; padding: 0; height: 100%; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2F2ZXVyMSIsImEiOiJjbGhqNjRhNHQwMDBnM2VvcDlkZnIyYjI0In0.mivybJHy1tDykpetIB-_nw';

        const center = [30.1127, -1.9577];
        let currentRadius = 300;

        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center,
          zoom: 15
        });

        let marker = new mapboxgl.Marker({ draggable: true })
          .setLngLat(center)
          .addTo(map);

        let circle;

        function drawCircle(lngLat, radiusInMeters) {
          const points = 64;
          const coords = {
            latitude: lngLat[1],
            longitude: lngLat[0]
          };
          const km = radiusInMeters / 1000;
          const ret = [];
          for (let i = 0; i < points; i++) {
            const bearing = i * 360 / points;
            const newCoord = turf.destination(coords, km, bearing, { units: 'kilometers' });
            ret.push(newCoord.geometry.coordinates);
          }
          ret.push(ret[0]);

          return {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [ret]
            }
          };
        }

        map.on('load', () => {
          const circleGeoJSON = drawCircle(center, currentRadius);

          map.addSource('circle', {
            type: 'geojson',
            data: circleGeoJSON
          });

          map.addLayer({
            id: 'circle-fill',
            type: 'fill',
            source: 'circle',
            paint: {
              'fill-color': '#FF0000',
              'fill-opacity': 0.2
            }
          });

          map.addLayer({
            id: 'circle-outline',
            type: 'line',
            source: 'circle',
            paint: {
              'line-color': '#FF0000',
              'line-width': 2
            }
          });

          marker.on('dragend', () => {
            const newCoords = marker.getLngLat();
            const newCircle = drawCircle([newCoords.lng, newCoords.lat], currentRadius);
            map.getSource('circle').setData(newCircle);

            window.ReactNativeWebView.postMessage(JSON.stringify({
              lng: newCoords.lng,
              lat: newCoords.lat
            }));
          });
        });

        // Handle radius update from React Native
        window.updateRadius = function(newRadius) {
          currentRadius = newRadius;
          const newCoords = marker.getLngLat();
          const newCircle = drawCircle([newCoords.lng, newCoords.lat], currentRadius);
          if (map.getSource('circle')) {
            map.getSource('circle').setData(newCircle);
          }
        };
      </script>
      <script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setCenter([data.lng, data.lat]);
  };

  const handleRadiusChange = (val) => {
    const parsed = parseInt(val) || 0;
    setRadius(parsed);
    webViewRef.current?.injectJavaScript(`window.updateRadius(${parsed}); true;`);
  };

  const handleContinue = () => {
    if (!collarId) {
      alert('Please enter a collar ID');
      return;
    }
    navigation.navigate('TrackingScreen', {
      center,
      radius,
      collarId
    });
  };

  return (
    <View className="flex-1 bg-white">
      <WebView
        ref={webViewRef}
        source={{ html }}
        onMessage={handleWebViewMessage}
        style={{ flex: 1 }}
        javaScriptEnabled
        originWhitelist={['*']}
      />
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
