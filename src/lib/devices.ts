import type { DeviceLocation } from "@/types";

// Static device location registry

export const DEVICE_LOCATIONS: DeviceLocation[] = [
    {
        endpoint: "30eda0a5f8c8",
        label: "Wild Mile",
        lat: 41.90757477534645,
        lng: -87.65264276429056,
    },
    {
        endpoint: "30eda0a5f780",
        label: "Roof",
        lat: 41.91427793569204,
        lng: -87.6881696515973,
    },
    // Add more devices here as they are deployed
];

// Look up a location by endpoint ID, falling back to a default label
export function getDeviceLocation(endpoint: string): DeviceLocation {
    return (
        DEVICE_LOCATIONS.find(d => d.endpoint === endpoint) ?? {
            endpoint,
            label: endpoint,
            lat: 0,
            lng: 0,
        }
    );
}
