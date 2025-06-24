import * as turf from '@turf/turf';
import type { FeatureCollection, Polygon } from 'geojson';
import { useRef, useEffect, useState } from "react";
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaBullseye } from "react-icons/fa";
import type { SensorFeed, VirtualBoundary } from "@/hooks/use-tracking";

interface GeofencingMapProps {
  feeds: SensorFeed[];
  boundaries: VirtualBoundary[];
  selectedFeed: SensorFeed | undefined;
}

const GeofencingMap = ({ feeds, boundaries, selectedFeed }: GeofencingMapProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasFitBounds, setHasFitBounds] = useState(false);

  // Generate GeoJSON for all farm boundaries
  const geofenceFeatures = boundaries.map(boundary => {
    const center = [boundary.farmCenterCoordinates.longitude, boundary.farmCenterCoordinates.latitude];
    return turf.circle(center, boundary.farmRadius / 1000, { steps: 64, units: 'kilometers' });
  });

  const geofenceGeoJSON: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: geofenceFeatures,
  };

  // Compute bounding box for all geofences
  const bbox = boundaries.length > 0 ? turf.bbox(geofenceGeoJSON) : null;
  const initialViewState = bbox
    ? {
        longitude: (bbox[0] + bbox[2]) / 2,
        latitude: (bbox[1] + bbox[3]) / 2,
        zoom: 12,
      }
    : {
        longitude: 30.08755,
        latitude: -1.9496,
        zoom: 15,
      };

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && bbox && !hasFitBounds) {
      mapRef.current.getMap().fitBounds(
        [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
        { padding: 80, duration: 1000 }
      );
      setHasFitBounds(true);
    }
  }, [bbox, hasFitBounds]);

  // Fly to selected animal when selectedFeed changes
  useEffect(() => {
    if (selectedFeed && mapRef.current) {
      const mapbox = mapRef.current.getMap();
      mapbox.flyTo({
        center: [selectedFeed.longitude, selectedFeed.latitude],
        zoom: 15,
        speed: 1.2,
        curve: 1.42,
        essential: true,
      });
    }
  }, [selectedFeed]);

  // Handler for geofence icon click (cycle through boundaries)
  const handleGeofenceClick = () => {
    if (!boundaries.length) return;
    const idx = currentIdx % boundaries.length;
    const boundary = boundaries[idx];
    const center = [boundary.farmCenterCoordinates.longitude, boundary.farmCenterCoordinates.latitude];
    const mapbox = mapRef.current && mapRef.current.getMap ? mapRef.current.getMap() : null;
    if (mapbox) {
      mapbox.flyTo({
        center,
        zoom: 15,
        speed: 1.2,
        curve: 1.42,
        essential: true,
      });
    }
    setCurrentIdx((prev) => (prev + 1) % boundaries.length);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      {/* Top right geofence icon button */}
      <button
        onClick={handleGeofenceClick}
        className="absolute top-4 right-4 z-10 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        title="Cycle Geofences"
      >
        <FaBullseye size={28} color="#E53935" />
      </button>
      {/* Mapbox Map */}
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ""}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Draw geofence circles */}
        {boundaries.length > 0 && (
          <Source id="geofences" type="geojson" data={geofenceGeoJSON}>
            <Layer
              id="geofence-fill"
              type="fill"
              paint={{
                'fill-color': '#E53935',
                'fill-opacity': 0.15,
              }}
            />
            <Layer
              id="geofence-outline"
              type="line"
              paint={{
                'line-color': '#E53935',
                'line-width': 2,
              }}
            />
          </Source>
        )}

        {/* Animal/collar markers from feeds */}
        {feeds.map(feed => (
          <Marker
            key={feed.collarId}
            longitude={feed.longitude}
            latitude={feed.latitude}
            anchor="bottom"
          >
            <div className="bg-white rounded-full border-2 border-[#E53935] w-6 h-6 flex items-center justify-center">
              <span role="img" aria-label="collar" className="text-[18px]">🐄</span>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  )
}

export default GeofencingMap;