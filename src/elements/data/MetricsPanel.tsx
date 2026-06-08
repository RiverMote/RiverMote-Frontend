import { useRef } from "react";
import type { Sample } from "@/types";
import { formatTime } from "@/lib/format";
import { formatMetricValue } from "@/elements/data/metrics";
import StatCard from "@/elements/ui/StatCard";

interface MetricsPanelProps {
    mode: "live" | "historical";
    sample: Sample | null;
    units: "metric" | "imperial";
    loading: boolean;
}

// Human-readable interpretations of select metrics, with color coding for severity

function turbidityLabel(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val < 1) {
        return { text: "Clear", color: "text-green-400" };
    }
    if (val < 5) {
        return { text: "Slightly turbid", color: "text-yellow-400" };
    }
    if (val < 50) {
        return { text: "Turbid", color: "text-orange-400" };
    }
    return { text: "Very turbid", color: "text-red-400" };
}

function tdsLabel(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val < 300) {
        return { text: "Excellent", color: "text-green-400" };
    }
    if (val < 600) {
        return { text: "Good", color: "text-yellow-400" };
    }
    if (val < 900) {
        return { text: "Fair", color: "text-orange-400" };
    }
    return { text: "Poor", color: "text-red-400" };
}

function pm1_25Label(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 12) {
        return { text: "Good", color: "text-green-400" };
    }
    if (val <= 35.4) {
        return { text: "Moderate", color: "text-yellow-400" };
    }
    if (val <= 55.4) {
        return { text: "Unhealthy for sensitive groups", color: "text-orange-400" };
    }
    if (val <= 150.4) {
        return { text: "Unhealthy", color: "text-red-400" };
    }
    if (val <= 250.4) {
        return { text: "Very unhealthy", color: "text-purple-400" };
    }
    return { text: "Hazardous", color: "text-maroon-400" };
}

function pm10Label(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 54) {
        return { text: "Good", color: "text-green-400" };
    }
    if (val <= 154) {
        return { text: "Moderate", color: "text-yellow-400" };
    }
    if (val <= 254) {
        return { text: "Unhealthy for sensitive groups", color: "text-orange-400" };
    }
    if (val <= 354) {
        return { text: "Unhealthy", color: "text-red-400" };
    }
    if (val <= 424) {
        return { text: "Very unhealthy", color: "text-purple-400" };
    }
    return { text: "Hazardous", color: "text-maroon-400" };
}

function ozoneLabel(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 0.054) {
        return { text: "Good", color: "text-green-400" };
    }
    if (val <= 0.07) {
        return { text: "Moderate", color: "text-yellow-400" };
    }
    if (val <= 0.085) {
        return { text: "Unhealthy for sensitive groups", color: "text-orange-400" };
    }
    if (val <= 0.105) {
        return { text: "Unhealthy", color: "text-red-400" };
    }
    if (val <= 0.2) {
        return { text: "Very unhealthy", color: "text-purple-400" };
    }
    return { text: "Hazardous", color: "text-maroon-400" };
}

export default function MetricsPanel({ mode, sample, units, loading }: MetricsPanelProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    if (!sample) {
        if (loading) {
            return <div className="h-full w-full loading-sheen border border-slate-300 rounded-lg" aria-busy="true" />;
        }
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                <span className="text-3xl">🗺</span>
                <p className="text-xl font-semibold text-slate-600">Select a station</p>
                <p className="text-sm text-slate-500">Click a marker on the map to view its data</p>
            </div>
        );
    }

    const turb = turbidityLabel(sample.turbidity);
    const tds = tdsLabel(sample.tds);
    const ozone = ozoneLabel(sample.ozone);
    const pm1_0 = pm1_25Label(sample.pm1_0);
    const pm2_5 = pm1_25Label(sample.pm2_5);
    const pm10 = pm10Label(sample.pm10);

    const handleScrollDown = () => {
        scrollRef.current?.scrollBy({ top: 220, behavior: "smooth" });
    };

    return (
        <div className={`relative h-full ${loading ? "loading-sheen" : ""}`} aria-busy={loading}>
            <div
                ref={scrollRef}
                className="flex flex-col gap-4 h-full overflow-y-auto p-4 border border-slate-300 rounded-lg"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl text-slate-600 font-semibold">
                        {mode === "live" ? "Latest Data" : "Historical Data"}
                    </h2>
                    <span className="text-xs font-mono text-slate-500">{formatTime(sample.unix_time)}</span>
                </div>

                {/* Water quality section */}
                <section className="border border-water-400 rounded-lg p-3">
                    <h3 className="text-xs uppercase tracking-widest text-water-500 mb-2">Water Quality</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <StatCard
                            label="Temperature"
                            value={formatMetricValue("water_temp", units, sample.water_temp)}
                        />
                        <StatCard
                            label="Turbidity"
                            value={formatMetricValue("turbidity", units, sample.turbidity)}
                            note={turb.text}
                            noteColor={turb.color}
                        />
                        <StatCard
                            label="TDS"
                            value={formatMetricValue("tds", units, sample.tds)}
                            note={tds.text}
                            noteColor={tds.color}
                        />
                    </div>
                </section>

                {/* Air / environment section */}
                <section className="border border-forest-400 rounded-lg p-3">
                    <h3 className="text-xs uppercase tracking-widest text-forest-400 mb-2">Atmosphere</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <StatCard label="Air Temp" value={formatMetricValue("air_temp", units, sample.air_temp)} />
                        <StatCard label="Humidity" value={formatMetricValue("humidity", units, sample.humidity)} />
                        <StatCard label="Pressure" value={formatMetricValue("baro", units, sample.baro)} />
                        <StatCard
                            label="Wind Speed"
                            value={formatMetricValue("air_velocity", units, sample.air_velocity)}
                        />
                        <StatCard label="UV Index" value={formatMetricValue("uv", units, sample.uv)} />
                        <StatCard label="Luminance" value={formatMetricValue("lum", units, sample.lum)} />
                    </div>
                </section>

                {/* Air quality section */}
                <section className="border border-slate-400 rounded-lg p-3">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Air Quality</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <StatCard
                            label="PM1.0"
                            value={formatMetricValue("pm1_0", units, sample.pm1_0)}
                            note={pm1_0.text}
                            noteColor={pm1_0.color}
                        />
                        <StatCard
                            label="PM2.5"
                            value={formatMetricValue("pm2_5", units, sample.pm2_5)}
                            note={pm2_5.text}
                            noteColor={pm2_5.color}
                        />
                        <StatCard
                            label="PM10"
                            value={formatMetricValue("pm10", units, sample.pm10)}
                            note={pm10.text}
                            noteColor={pm10.color}
                        />
                        <StatCard
                            label="Ozone"
                            value={formatMetricValue("ozone", units, sample.ozone)}
                            note={ozone.text}
                            noteColor={ozone.color}
                        />
                    </div>
                </section>
            </div>
            <button
                type="button"
                onClick={handleScrollDown}
                aria-label="Scroll down"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs text-slate-500 shadow-sm transition hover:text-slate-700"
            >
                ↓
            </button>
        </div>
    );
}
