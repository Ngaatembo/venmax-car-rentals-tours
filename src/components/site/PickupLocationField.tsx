import { useState } from "react";
import { ChevronDown, LocateFixed, MapPin } from "lucide-react";

export const PICKUP_PRESETS = [
  "VenMax Office - Milton Park, Harare",
  "RGM Airport",
  "Harare CBD",
] as const;

const CUSTOM_VALUE = "__custom__";

/**
 * Pick-up / delivery location field used on the hero quick-booking widget
 * and the full /book form. Combines three ways to answer it, since a lot
 * of visitors won't know (or want to type) an exact address:
 *  - a dropdown of common VenMax pickup spots
 *  - free text for anything else ("Other location")
 *  - a "Use my current location" button that reads GPS and reverse-geocodes
 *    it to a readable address via OpenStreetMap's free Nominatim API
 */
export function PickupLocationField({
  value,
  onChange,
  inputClassName,
  selectClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  inputClassName: string;
  selectClassName: string;
}) {
  const isPreset = (PICKUP_PRESETS as readonly string[]).includes(value);
  const [showCustom, setShowCustom] = useState(!isPreset && value !== "");
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const selectValue = showCustom ? CUSTOM_VALUE : value;

  function handleSelectChange(next: string) {
    setLocateError(null);
    if (next === CUSTOM_VALUE) {
      setShowCustom(true);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(next);
    }
  }

  function handleUseMyLocation() {
    setLocateError(null);
    if (!("geolocation" in navigator)) {
      setLocateError("Location isn't available on this device/browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          const data = await response.json();
          const address: string | undefined = data?.display_name;
          setShowCustom(true);
          onChange(address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } catch {
          setShowCustom(true);
          onChange(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocateError("Couldn't get your location — check location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="grid gap-2">
      <span className="relative block">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <select
          value={selectValue}
          onChange={(e) => handleSelectChange(e.target.value)}
          className={`${selectClassName} appearance-none pl-9 pr-9`}
        >
          <option value="" disabled>
            Choose a pick-up location…
          </option>
          {PICKUP_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
          <option value={CUSTOM_VALUE}>Other location (type it in)</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </span>

      {showCustom && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type the pick-up address"
          className={inputClassName}
        />
      )}

      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={locating}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 disabled:opacity-60"
      >
        <LocateFixed className="h-3.5 w-3.5" />
        {locating ? "Finding you…" : "Use my current location"}
      </button>
      {locateError && <span className="text-xs text-destructive">{locateError}</span>}
    </div>
  );
}
