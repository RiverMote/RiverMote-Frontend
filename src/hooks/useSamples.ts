import { useState, useEffect, useCallback } from "react";
import { fetchSamples } from "@/lib/api";
import type { Sample } from "@/types";

interface UseSamplesOptions {
    endpoint: string | null;
    limit?: number | "all";
    pollInterval?: number;
    units?: "imperial" | "metric";
}

interface UseSamplesResult {
    samples: Sample[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useSamples({
    endpoint,
    limit = 100,
    pollInterval = 0,
    units = "imperial",
}: UseSamplesOptions): UseSamplesResult {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!endpoint) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSamples(endpoint, limit);
            if (units === "metric") {
                setSamples(data);
                return;
            }
            // Convert to imperial
            const converted = data.map((s: Sample) => ({
                ...s,
                water_temp: s.water_temp !== null ? (s.water_temp * 9) / 5 + 32 : null, // °C to °F
                air_temp: s.air_temp !== null ? (s.air_temp * 9) / 5 + 32 : null, // °C to °F
                air_velocity: s.air_velocity !== null ? s.air_velocity * 2.2369362921 : null, // m/s to mph
                air_velocity_peak: s.air_velocity_peak !== null ? s.air_velocity_peak * 2.2369362921 : null, // m/s to mph
                baro: s.baro !== null ? s.baro * 0.02952998057228 : null, // hPa to inHg
            }));
            setSamples(converted);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [endpoint, limit, units]);

    useEffect(() => {
        // FIXME: look into better ways to handle this
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSamples([]);
        void load();
    }, [load]);

    useEffect(() => {
        if (pollInterval < 1 || !endpoint) {
            return;
        }
        const id = setInterval(() => void load(), pollInterval);
        return () => clearInterval(id);
    }, [pollInterval, endpoint, load]);

    return { samples, loading, error, refresh: load };
}
