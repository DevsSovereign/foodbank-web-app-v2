"use client";

import { useCallback, useEffect, useState } from "react";

const LAGOS_FALLBACK: google.maps.LatLngLiteral = { lat: 6.5244, lng: 3.3792 };

interface Props {
  isDetectAddress?: boolean;
}

const useUserLocation = ({ isDetectAddress = false }: Props) => {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>(LAGOS_FALLBACK);
  const [customerAddress, setCustomerAddress] = useState<string>(
    "Detecting your current location…",
  );
  const [customerState, setCustomerState] = useState<string>("");

  const handleFetchAddress = async (coords: typeof LAGOS_FALLBACK): Promise<string[] | string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`,
        { headers: { "Accept-Language": "en" } },
      );

      const data = await res.json();
      const address = data.address ?? {};

      const parts = [
        address.house_number,
        address.road,
        address.suburb ?? address.neighbourhood ?? address.quarter,
        address.city ?? address.town ?? address.village,
        address.state,
      ].filter(Boolean);

      // specifically map out the state
      setCustomerState(address.state);

      return parts;
    } catch (error) {
      console.log(error);
      return "Network Error";
    }
  };

  // User-triggered locate (shows spinner)
  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, []);

  // get user longitude and latitude
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, []);

  // get user address
  useEffect(() => {
    if (!isDetectAddress) return;

    const detectAddress = async (): Promise<string> => {
      if (!navigator.geolocation) {
        const parts = (await handleFetchAddress({
          lat: LAGOS_FALLBACK.lat,
          lng: LAGOS_FALLBACK.lng,
        })) as string[];

        return parts.join(", ");
      }

      return new Promise<string>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            try {
              const parts = (await handleFetchAddress({
                lat: coords.latitude,
                lng: coords.longitude,
              })) as string[];

              resolve(parts.join(", "));
            } catch {
              const parts = (await handleFetchAddress({
                lat: LAGOS_FALLBACK.lat,
                lng: LAGOS_FALLBACK.lng,
              })) as string[];

              return parts.join(", ");
            }
          },
          async () => {
            const parts = (await handleFetchAddress({
              lat: LAGOS_FALLBACK.lat,
              lng: LAGOS_FALLBACK.lng,
            })) as string[];

            resolve(parts.join(", "));
          },
          { timeout: 8000 },
        );
      });
    };

    detectAddress().then(setCustomerAddress);
  }, [isDetectAddress]);

  return {
    isLocating,
    setIsLocating,
    handleLocateUser,
    userLocation,
    setUserLocation,
    customerAddress,
    setCustomerAddress,
    customerState,
  };
};

export default useUserLocation;
