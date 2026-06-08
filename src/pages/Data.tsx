import { useState, useMemo, useEffect } from "react";
import { useDevices } from "@/hooks/useDevices";
import { useLatestSamples, useSamples } from "@/hooks/useSamples";
import { useUnits } from "@/hooks/useUnits";
import DeviceMap from "@/elements/map/DeviceMap";
import MetricsPanel from "@/elements/data/MetricsPanel";
import ChartSection from "@/elements/data/ChartSection";
import { POLLING } from "@/lib/polling";

type Mode = "live" | "historical";

const STORAGE_ENDPOINT_KEY = "rivermote:selectedEndpoint";

export default function Data() {
    const { devices, loading: devicesLoading } = useDevices();
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(() => {
        return localStorage.getItem(STORAGE_ENDPOINT_KEY);
    });
    const [mode, setMode] = useState<Mode>("live");
    const { units, setUnits } = useUnits();
    const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000));

    // Persist selected endpoint and units to local storage so they survive page reloads
    useEffect(() => {
        if (selectedEndpoint) {
            localStorage.setItem(STORAGE_ENDPOINT_KEY, selectedEndpoint);
        } else {
            localStorage.removeItem(STORAGE_ENDPOINT_KEY);
        }
    }, [selectedEndpoint]);

    /* Live mode */

    // In live mode, keep track of the current time to filter samples to the last 24h
    // and trigger re-renders on the configured polling interval
    useEffect(() => {
        if (mode !== "live") {
            return;
        }

        const refreshNow = () => setNowSeconds(Math.floor(Date.now() / 1000));
        const timeout = window.setTimeout(refreshNow, 0);
        const interval = window.setInterval(() => {
            setNowSeconds(Math.floor(Date.now() / 1000));
        }, POLLING.samplesMs);

        return () => {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
        };
    }, [mode]);

    // Live mode: request last 100 samples, and configure polling on the configured interval
    const { samples: liveSamples, loading: liveLoading } = useSamples({
        endpoint: mode === "live" ? selectedEndpoint : null,
        limit: 100, // Our limit should be set a bit higher than 24h ago, so we can cut off to exactly 24h
        units,
        pollInterval: POLLING.samplesMs,
    });

    /* Historical mode */

    // Historical date range: stored as ISO date strings for input[type=date]
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().slice(0, 10);
    });
    const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

    // Historical mode: request all samples in the selected date range
    const historicalRange = useMemo(() => {
        const from = new Date(fromDate + "T00:00:00").getTime() / 1000;
        const to = new Date(toDate + "T00:00:00").getTime() / 1000 + 86400; // inclusive of end day
        return { from, to };
    }, [fromDate, toDate]);
    const {
        samples: historicalSamples,
        loading: histLoading,
        truncated: historicalTruncated,
    } = useSamples({
        endpoint: mode === "historical" ? selectedEndpoint : null,
        limit: "all",
        start: historicalRange.from,
        end: historicalRange.to,
        units,
    });

    // Latest sample for all devices, used for hover popups on the map
    const { samples: latestSamplesAll, loading: latestLoading } = useLatestSamples({
        pollInterval: POLLING.samplesMs,
        units,
    });

    // Send out a request for either live or historical samples based on the selected mode
    const rawSamples = mode === "live" ? liveSamples : historicalSamples;
    const loading = mode === "live" ? liveLoading : histLoading; // Loading state for API request

    const samples = useMemo(() => {
        // For historical mode, the backend has already filtered to the selected date range, so we can just return what we got
        if (mode === "historical") {
            return rawSamples;
        }
        // For live mode, use a rolling 24h window based on the current time
        const cutoff = nowSeconds - 86400;
        return rawSamples.filter(s => s.unix_time >= cutoff);
    }, [rawSamples, mode, nowSeconds]);

    // Most recent sample per device (used by the map for hover popups)
    const latestSamples = useMemo(() => {
        const map: Record<string, (typeof latestSamplesAll)[0]> = {};
        latestSamplesAll.forEach(s => {
            if (!map[s.endpoint]) {
                map[s.endpoint] = s;
            }
        });
        return map;
    }, [latestSamplesAll]);

    const latestSample = samples.length > 0 ? samples[0] : null;

    return (
        <div className="min-h-screen px-4 md:px-6 py-6">
            {/* Mode toggle */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex rounded-full border border-slate-300 overflow-hidden">
                    {(["live", "historical"] as Mode[]).map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-150 ${
                                mode === m ? "bg-forest-700 text-white" : "text-slate-600 hover:text-slate-400"
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                {/* For historical mode: date range picker */}
                {mode === "historical" && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                            className="bg-forest-500 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                            className="bg-forest-500 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                    </div>
                )}
                <div className="flex rounded-full border border-slate-300 overflow-hidden ml-auto">
                    {(["metric", "imperial"] as const).map(option => (
                        <button
                            key={option}
                            onClick={() => setUnits(option)}
                            className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-150 ${
                                units === option ? "bg-forest-700 text-white" : "text-slate-600 hover:text-slate-400"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main layout: map (left) + metrics (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: "520px" }}>
                <DeviceMap
                    devices={devices}
                    latestSamples={latestSamples}
                    units={units}
                    selectedEndpoint={selectedEndpoint}
                    onSelect={setSelectedEndpoint}
                    loading={devicesLoading || latestLoading}
                />

                <div className="panel overflow-hidden">
                    <MetricsPanel
                        mode={mode}
                        sample={latestSample}
                        units={units}
                        loading={loading && !!selectedEndpoint}
                    />
                </div>
            </div>

            {/* Charts are full width below the map/metrics split */}
            {mode === "historical" && historicalTruncated ? (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Not all data from the requested date range could be displayed. Please choose a narrower range and
                    try again.
                </div>
            ) : null}
            {selectedEndpoint && (samples.length > 0 || loading) && (
                <ChartSection samples={samples} units={units} loading={loading} />
            )}
        </div>
    );
}
