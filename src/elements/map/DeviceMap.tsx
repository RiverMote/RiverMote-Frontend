import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Device, Sample } from "@/types";
import { fmt } from "@/lib/format";

// @ts-expect-error: Allow side-effect import of CSS without type declarations
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [41.9125069, -87.7427352]; // Default map center (Chicago) for when no device is selected
const DEFAULT_ZOOM = 11; // Default zoom level when no device is selected
const FLY_TIMEOUT_MS = 200; // Delay before flying to a newly selected device
const FLY_DURATION_S = 1.2; // Duration of the fly animation in seconds

interface DeviceMapProps {
    devices: Device[];
    // Most recent sample per device, keyed by endpoint, used for hover preview
    latestSamples: Record<string, Sample>;
    selectedEndpoint: string | null;
    onSelect: (endpoint: string | null) => void;
    loading?: boolean;
}

// Create a custom marker icon that changes color based on state
function makeIcon(selected: boolean) {
    const color = selected ? "#0ea5e9" : "#348536";
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <ellipse cx="14" cy="34" rx="6" ry="2" fill="rgba(0,0,0,0.3)"/>
        <path d="M14 2C8.48 2 4 6.48 4 12c0 7.5 10 22 10 22s10-14.5 10-22c0-5.52-4.48-10-10-10z"
              fill="${color}" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
        <circle cx="14" cy="12" r="4" fill="white" fill-opacity="0.9"/>
    </svg>`;
    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38],
    });
}

export default function DeviceMap({
    devices,
    latestSamples,
    selectedEndpoint,
    onSelect,
    loading = false,
}: DeviceMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const flyTimeoutRef = useRef<number | null>(null);
    // Keep marker refs so we can update icons when selection changes
    const markersRef = useRef<Map<string, L.Marker>>(new Map());

    // Initialize the map once on mount
    useEffect(() => {
        if (!containerRef.current || mapRef.current) {
            return;
        }
        mapRef.current = L.map(containerRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            className: "map-tiles",
        }).addTo(mapRef.current);

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    // Add/update markers whenever the device list or latest samples change
    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        // Remove stale markers for devices no longer present
        markersRef.current.forEach((marker, endpoint) => {
            if (!devices.find(d => d.endpoint === endpoint)) {
                marker.remove();
                markersRef.current.delete(endpoint);
            }
        });

        devices.forEach(device => {
            const sample = latestSamples[device.endpoint];
            const isSelected = device.endpoint === selectedEndpoint;
            // Don't show markers for devices without valid location, and remove existing if they move to invalid
            if (device.lat === null || device.lng === null) {
                const existing = markersRef.current.get(device.endpoint);
                if (existing) {
                    existing.remove();
                    markersRef.current.delete(device.endpoint);
                }
                return;
            }
            const label = device.name?.trim() ? device.name : device.endpoint;

            // Build the hover popup content for at-a-glance stats
            const popupHtml = `
                <div class="min-w-37">
                    <div class="text-lg text-slate-700 font-semibold mb-2">${label}</div>
                    ${
                        sample
                            ? `
                        <div class="font-mono text-slate-500">
                            <div>💧 ${fmt(sample.water_temp, 1, "°C")} water</div>
                            <div>🌫 TDS ${fmt(sample.tds, 0, " ppm")}</div>
                            <div>🌡 ${fmt(sample.air_temp, 1, "°C")} air</div>
                        </div>`
                            : `<div class="text-sm text-slate-500">Click to see data</div>`
                    }
                </div>
            `;

            const existing = markersRef.current.get(device.endpoint);
            if (existing) {
                // Update icon and popup if the marker already exists
                existing.setIcon(makeIcon(isSelected));
                existing.getPopup()?.setContent(popupHtml);
            } else {
                // Create a new marker
                const marker = L.marker([device.lat, device.lng], {
                    icon: makeIcon(isSelected),
                })
                    .addTo(mapRef.current!)
                    .bindPopup(popupHtml, { closeButton: false });

                marker
                    .on("click", () => onSelect(device.endpoint))
                    .on("mouseover", () => marker.openPopup())
                    .on("mouseout", () => marker.closePopup());
                markersRef.current.set(device.endpoint, marker);
            }
        });
    }, [devices, latestSamples, selectedEndpoint, onSelect]);

    // Fly to selected device when it changes (after a short delay)
    useEffect(() => {
        if (!mapRef.current || !selectedEndpoint) {
            return;
        }
        const selected = devices.find(device => device.endpoint === selectedEndpoint);
        if (!selected || selected.lat === null || selected.lng === null) {
            return;
        }
        const flyLat = selected.lat;
        const flyLng = selected.lng;
        if (flyTimeoutRef.current) {
            window.clearTimeout(flyTimeoutRef.current);
        }
        flyTimeoutRef.current = window.setTimeout(() => {
            mapRef.current?.flyTo([flyLat, flyLng], 14, { duration: FLY_DURATION_S });
        }, FLY_TIMEOUT_MS);

        return () => {
            if (flyTimeoutRef.current) {
                window.clearTimeout(flyTimeoutRef.current);
                flyTimeoutRef.current = null;
            }
        };
    }, [selectedEndpoint, devices]);

    // Return to default view when selection clears
    useEffect(() => {
        if (!mapRef.current || selectedEndpoint) {
            return;
        }
        mapRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: FLY_DURATION_S });
    }, [selectedEndpoint]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-300" aria-busy={loading}>
            <div ref={containerRef} className="w-full h-full" style={{ minHeight: "400px" }} />
            {loading && <div className="loading-sheen loading-sheen-overlay" />}
            {selectedEndpoint ? (
                <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className="z-1500 absolute top-3 right-3 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs text-slate-500 shadow-sm transition hover:text-slate-700"
                >
                    Reset view
                </button>
            ) : null}
        </div>
    );
}
