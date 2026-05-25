/* eslint-disable @typescript-eslint/no-explicit-any */
type PlacePrediction = {
  placeId: string;
  text: string;
  secondaryText?: string;
};

export const ALLOWED_STATES = ["Lagos", "Oyo"] as const;

const GOOGLE_PLACES_V1 = "https://places.googleapis.com/v1/places:autocomplete";

/**
 * Restriction box (South-West Nigeria) - includes Lagos + Oyo.
 */
const LOCATION_RESTRICTION = {
  rectangle: {
    low: { latitude: 6.1, longitude: 2.6 },
    high: { latitude: 8.7, longitude: 4.8 },
  },
};

export async function autocompletePlaces({ input, apiKey }: { input: string; apiKey: string }) {
  if (!input || input.trim().length < 2) return [];

  const res = await fetch(GOOGLE_PLACES_V1, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
    },
    body: JSON.stringify({
      input,
      includedRegionCodes: ["NG"],
      locationRestriction: LOCATION_RESTRICTION,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("places error", res.status, text);
    return [];
  }

  const json = await res.json();

  const suggestions = (json?.suggestions || [])
    .map((s: any) => s?.placePrediction)
    .filter(Boolean)
    .map((p: any) => {
      const text = p?.text?.text || "";
      const secondaryText = p?.structuredFormat?.secondaryText?.text || "";
      return {
        placeId: p?.placeId,
        text,
        secondaryText,
      };
    });
  // strict filter for Lagos/Oyo only
  // .filter((p: any) => isAllowedState(`${p.text} ${p.secondaryText}`)) || [];

  return suggestions as PlacePrediction[];
}
