import React, { useRef, useEffect } from "react";
import { MapPin, LocateFixed, Loader2, X } from "lucide-react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

interface Props {
  onSelectAddress: (address: string, latLng: google.maps.LatLngLiteral) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export default function AddressSearch({
  onSelectAddress,
  onUseCurrentLocation,
  isLocating,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ng" },
      types: ["geocode", "establishment"],
    },
    debounce: 300,
    cache: 24 * 60 * 60,
  });

  const isOpen = (status === "OK" || value.length === 0) && ready;
  const hasSuggestions = status === "OK" && data.length > 0;

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        clearSuggestions();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [clearSuggestions]);

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const latLng = await getLatLng(results[0]);
      onSelectAddress(description, latLng);
    } catch {
      // geocode failed silently; address text is still set
    }
  };

  const handleClear = () => {
    setValue("");
    clearSuggestions();
  };

  const showDropdown = (hasSuggestions || value.length === 0) && document.activeElement !== null;

  return (
    <div ref={dropdownRef} className="relative">
      <div className="bg-white rounded-md shadow-md flex items-center px-4 py-3 border-2 border-transparent focus-within:border-[#70c400] transition-colors">
        <MapPin className="size-4 text-gray-500 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Delivery Address"
          className="flex-1 min-w-0 outline-none text-sm font-semibold text-gray-700 bg-transparent placeholder-gray-500"
          value={value}
          disabled={!ready}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
        />
        {value && value.length > 0 ? (
          <button
            className="text-gray-400 hover:text-gray-600 ml-3 shrink-0 transition cursor-pointer"
            onMouseDown={(e) => {
              e.preventDefault();
              handleClear();
            }}
          >
            <X className="size-4" />
          </button>
        ) : (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onUseCurrentLocation();
              clearSuggestions();
            }}
            disabled={isLocating}
            className="text-gray-400 hover:text-gray-600 ml-3 shrink-0 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLocating ? (
              <Loader2 className="size-5 text-black shrink-0 animate-spin" />
            ) : (
              <LocateFixed className="size-5 animate-pulse text-[#fb2c36] shrink-0" />
            )}
          </button>
        )}
      </div>

      {/* Dropdown — shows on focus when empty OR when there are suggestions */}
      {hasSuggestions && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 max-h-80 overflow-y-auto transition-all duration-150 ${
            showDropdown
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          {/* Use Current Location */}
          {/* <button
          className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition text-left cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            onUseCurrentLocation();
            clearSuggestions();
          }}
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="size-5 text-[#70c400] shrink-0 animate-spin" />
          ) : (
            <LocateFixed className="size-5 text-[#70c400] shrink-0" />
          )}
          <span className="text-sm font-bold text-[#70c400]">
            {isLocating ? "Getting location…" : "Use Current Location"}
          </span>
        </button> */}

          {/* Autocomplete suggestions */}

          <>
            <div className="mx-6 my-1 border-t border-gray-100" />
            {data.map(({ place_id, description, structured_formatting }) => (
              <button
                key={place_id}
                className="w-full flex items-start gap-4 px-6 py-3.5 hover:bg-gray-50 transition text-left cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(description);
                }}
              >
                <MapPin className="size-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-700 truncate">
                    {structured_formatting.main_text}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {structured_formatting.secondary_text}
                  </span>
                </span>
              </button>
            ))}
          </>
        </div>
      )}
    </div>
  );
}
