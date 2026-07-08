import { useState, useEffect, useCallback } from "react";
import { fetchSamples } from "@/lib/api";
import type { Sample } from "@/types";

interface UseSamplesOptions {
    endpoint: string | null;
    limit?: number | "all";
    start?: number;
    end?: number;
    pollInterval?: number;
    units?: "imperial" | "metric";
}

interface UseSamplesResult {
    samples: Sample[];
    truncated: boolean;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const convertToImperial = (samples: Sample[]): Sample[] =>
    samples.map(sample => ({
        ...sample,
        water_temp: sample.water_temp !== null ? (sample.water_temp * 9) / 5 + 32 : null, // °C to °F
        air_temp: sample.air_temp !== null ? (sample.air_temp * 9) / 5 + 32 : null, // °C to °F
        baro: sample.baro !== null ? sample.baro * 0.02952998057228 : null, // hPa to inHg
        alt: sample.alt !== null ? sample.alt * 3.28084 : null, // m to ft
        air_velocity: sample.air_velocity !== null ? sample.air_velocity * 2.2369362921 : null, // m/s to mph
        air_velocity_peak: sample.air_velocity_peak !== null ? sample.air_velocity_peak * 2.2369362921 : null, // m/s to mph
        chamber_temp: sample.chamber_temp !== null ? (sample.chamber_temp * 9) / 5 + 32 : null, // °C to °F
    }));

export function useSamples({
    endpoint,
    limit = 100,
    start,
    end,
    pollInterval = 0,
    units = "imperial",
}: UseSamplesOptions): UseSamplesResult {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [truncated, setTruncated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!endpoint) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSamples({ endpoint, limit, start, end });
            setTruncated(data.truncated);
            if (units === "imperial") {
                setSamples(convertToImperial(data.samples));
                return;
            }
            setSamples(data.samples);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [endpoint, limit, start, end, units]);

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

    return { samples, truncated, loading, error, refresh: load };
}

export function useLatestSamples({ pollInterval = 0, units = "imperial" }): UseSamplesResult {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [truncated, setTruncated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSamples();
            setTruncated(data.truncated);
            if (units === "imperial") {
                setSamples(convertToImperial(data.samples));
                return;
            }
            setSamples(data.samples);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [units]);

    useEffect(() => {
        // FIXME: same issue as above, need to look into better ways to handle this
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void load();
    }, [load]);

    useEffect(() => {
        if (pollInterval < 1) {
            return;
        }
        const id = setInterval(() => void load(), pollInterval);
        return () => clearInterval(id);
    }, [pollInterval, load]);

    return { samples, truncated, loading, error, refresh: load };
}
