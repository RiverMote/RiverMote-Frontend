import { useState, useEffect, useCallback } from "react";
import { fetchSamples } from "@/lib/api";
import type { Sample } from "@/types";

interface UseSamplesOptions {
    endpoint: string | null;
    limit?: number | "all";
    pollInterval?: number;
}

interface UseSamplesResult {
    samples: Sample[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useSamples({ endpoint, limit = 100, pollInterval = 0 }: UseSamplesOptions): UseSamplesResult {
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
            setSamples(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [endpoint, limit]);

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
