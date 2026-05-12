import { useState, useEffect } from "react";
import { fetchDevices } from "@/lib/api";
import type { Device } from "@/types";

interface UseDevicesResult {
    devices: Device[];
    loading: boolean;
    error: string | null;
}

export function useDevices(): UseDevicesResult {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDevices()
            .then(setDevices)
            .catch(e => setError(e instanceof Error ? e.message : "Unknown error"))
            .finally(() => setLoading(false));
    }, []);

    return { devices, loading, error };
}
