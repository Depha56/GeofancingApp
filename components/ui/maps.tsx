import { WebView } from 'react-native-webview';

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <style>
      body, html, #map { margin: 0; height: 100%; width: 100%; }
      .marker {
        background-image: url('https://cdn-icons-png.flaticon.com/512/684/684908.png');
        background-size: cover;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
      }
      .mapboxgl-popup {
        max-width: 200px;
      }
      .mapboxgl-popup-content {
        font-size: 12px;
        padding: 4px 8px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2F2ZXVyMSIsImEiOiJjbGhqNjRhNHQwMDBnM2VvcDlkZnIyYjI0In0.mivybJHy1tDykpetIB-_nw';

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [30.1127, -1.9577],
            zoom: 15
        });

        const center = [30.1127, -1.9577]; // Bweramvura

        // Marker setup
        const el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker(el)
            .setLngLat([30.1127, -1.9577])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Bweramvura'))
            .addTo(map);

        // Generate circle GeoJSON (simple approximation)
        function createGeoFence(center, radiusInMeters, points = 64) {
            const coords = {
            latitude: center[1],
            longitude: center[0]
            };

            const km = radiusInMeters / 1000;
            const ret = [];
            const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
            const distanceY = km / 110.574;

            for (let i = 0; i < points; i++) {
            const theta = (i / points) * (2 * Math.PI);
            const x = distanceX * Math.cos(theta);
            const y = distanceY * Math.sin(theta);

            ret.push([coords.longitude + x, coords.latitude + y]);
            }
            ret.push(ret[0]); // close the loop
            return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [ret]
            }
            };
        }

        map.on('load', function () {
            // Add fence circle as GeoJSON
            const fence = createGeoFence(center, 200); // 200 meters radius

            map.addSource('geofence', {
                type: 'geojson',
                data: fence
            });

            map.addLayer({
            id: 'geofence-layer',
            type: 'fill',
            source: 'geofence',
            layout: {},
            paint: {
                'fill-color': '#E53935',
                'fill-opacity': 0.2
            }
            });

            map.addLayer({
            id: 'geofence-outline',
            type: 'line',
            source: 'geofence',
            paint: {
                'line-color': '#E53935',
                'line-width': 2
            }
            });
        });
        </script>

  </body>
</html>
`;

export default function MapboxWeb() {
  return <WebView originWhitelist={['*']} source={{ html }} style={{ flex: 1 }} />;
}

