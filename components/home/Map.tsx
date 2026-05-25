"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLoadScript } from "@react-google-maps/api";

import AddressSearch from "./map/AddressSearch";
import useUserLocation from "@/hooks/useUserLocation";

// MapView uses browser-only Google Maps APIs — load without SSR
const MapView = dynamic(() => import("./map/MapView"), { ssr: false });

const LIBRARIES: ("places" | "geometry")[] = ["places"];

export default function HomePageMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const { isLocating, handleLocateUser, userLocation, setUserLocation } = useUserLocation({});

  const handleSelectAddress = (_address: string, latLng: google.maps.LatLngLiteral) => {
    setMarkerPosition(latLng);
    setUserLocation(latLng);
  };

  const handleUseCurrentLocation = () => {
    handleLocateUser();
    setMarkerPosition(null);
  };

  const handleMapClick = (latLng: google.maps.LatLngLiteral) => {
    setMarkerPosition(latLng);
  };

  return (
    <div className="lg:col-span-3 relative min-h-75 md:min-h-95 z-20">
      <div className="absolute inset-0 rounded-xl overflow-hidden shadow-sm z-0">
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e2336] rounded-xl text-white/60 text-sm">
            Map failed to load.
          </div>
        )}

        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e2336] rounded-xl">
            <span className="size-6 rounded-full border-2 border-[#70c400] border-t-transparent animate-spin" />
          </div>
        )}

        {isLoaded && !loadError && (
          <MapView
            center={userLocation}
            markerPosition={markerPosition}
            onMapClick={handleMapClick}
          />
        )}
      </div>

      {/* Address search overlay */}
      <div className="absolute top-4 left-4 right-4 md:right-1/4 lg:right-[15%] z-50">
        {isLoaded && (
          <AddressSearch
            onSelectAddress={handleSelectAddress}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
          />
        )}
      </div>
    </div>
  );
}
