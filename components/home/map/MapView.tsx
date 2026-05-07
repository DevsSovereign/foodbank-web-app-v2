import React, { useEffect, useRef } from "react";
import { GoogleMap, Marker, Circle, useGoogleMap } from "@react-google-maps/api";

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1e2336" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e2336" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: MAP_STYLES,
  gestureHandling: "cooperative",
};

interface Props {
  center: google.maps.LatLngLiteral;
  markerPosition: google.maps.LatLngLiteral | null;
  onMapClick: (latLng: google.maps.LatLngLiteral) => void;
}

function PanToCenter({ center }: { center: google.maps.LatLngLiteral }) {
  const map = useGoogleMap();
  const prevCenter = useRef(center);

  useEffect(() => {
    if (map && (prevCenter.current.lat !== center.lat || prevCenter.current.lng !== center.lng)) {
      map.panTo(center);
      prevCenter.current = center;
    }
  }, [map, center]);

  return null;
}

export default function MapView({ center, markerPosition, onMapClick }: Props) {
  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  return (
    <GoogleMap
      mapContainerClassName="absolute inset-0 size-full rounded-xl"
      center={center}
      zoom={15}
      options={MAP_OPTIONS}
      onClick={handleClick}
    >
      <PanToCenter center={center} />

      {/* Accuracy pulse ring */}
      <Circle
        center={center}
        radius={80}
        options={{
          strokeColor: "#3b82f6",
          strokeOpacity: 0.4,
          strokeWeight: 1,
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
        }}
      />

      {/* User location dot */}
      <Marker
        position={center}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }}
      />

      {/* Delivery address marker (distinct from location dot) */}
      {markerPosition &&
        (markerPosition.lat !== center.lat || markerPosition.lng !== center.lng) && (
          <Marker
            position={markerPosition}
            icon={{
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 7,
              fillColor: "#70c400",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}
    </GoogleMap>
  );
}
