import { useState, useMemo } from "react";
import { useDevices } from "@/hooks/useDevices";
import { useSamples } from "@/hooks/useSamples";
import DeviceMap from "@/elements/map/DeviceMap";
import MetricsPanel from "@/elements/data/MetricsPanel";
import ChartSection from "@/elements/data/ChartSection";
import { POLLING } from "@/lib/polling";

type Mode = "live" | "historical";

export default function Data() {
    const { devices, loading: devicesLoading } = useDevices();
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("live");

    // Historical date range: stored as ISO date strings for input[type=date]
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().slice(0, 10);
    });
    const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

    // Live mode: last 100 samples, polling on the configured interval
    const { samples: liveSamples, loading: liveLoading } = useSamples({
        endpoint: mode === "live" ? selectedEndpoint : null,
        limit: 100,
        pollInterval: POLLING.samplesMs,
    });

    // Historical mode: all samples (backend will apply its own cap)
    const { samples: historicalSamples, loading: histLoading } = useSamples({
        endpoint: mode === "historical" ? selectedEndpoint : null,
        limit: "all",
    });

    const rawSamples = mode === "live" ? liveSamples : historicalSamples;
    const loading = mode === "live" ? liveLoading : histLoading;

    // Filter historical samples to the selected date range client-side
    const samples = useMemo(() => {
        if (mode !== "historical") {
            return rawSamples;
        }
        const from = new Date(fromDate).getTime() / 1000;
        const to = new Date(toDate).getTime() / 1000 + 86400; // inclusive of end day
        return rawSamples.filter(s => s.unix_time >= from && s.unix_time <= to);
    }, [rawSamples, mode, fromDate, toDate]);

    // Most recent sample per device (used by the map for hover popups)
    const latestSamples = useMemo(() => {
        const map: Record<string, (typeof samples)[0]> = {};
        // Samples are newest-first from the API
        samples.forEach(s => {
            if (!map[s.endpoint]) {
                map[s.endpoint] = s;
            }
        });
        // Also include live latest from all devices, not just selected
        return map;
    }, [samples]);

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
            </div>

            {/* Main layout: map (left) + metrics (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: "520px" }}>
                <DeviceMap
                    devices={devices}
                    latestSamples={latestSamples}
                    selectedEndpoint={selectedEndpoint}
                    onSelect={setSelectedEndpoint}
                    loading={devicesLoading}
                />

                <div className="panel overflow-hidden">
                    <MetricsPanel sample={latestSample} loading={loading && !!selectedEndpoint} />
                </div>
            </div>

            {/* Charts are full width below the map/metrics split */}
            {selectedEndpoint && (samples.length > 0 || loading) && (
                <ChartSection samples={samples} loading={loading} />
            )}
        </div>
    );
}
