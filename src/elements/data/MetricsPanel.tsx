import type { Sample } from "@/types";
import { fmt, formatTime } from "@/lib/format";
import StatCard from "@/elements/ui/StatCard";

interface MetricsPanelProps {
    sample: Sample | null;
    loading: boolean;
}

// Interpret turbidity into a human-readable water clarity label
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

// Interpret TDS into a water quality label
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

export default function MetricsPanel({ sample, loading }: MetricsPanelProps) {
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

    return (
        <div className={`h-full ${loading ? "loading-sheen" : ""}`} aria-busy={loading}>
            <div className="flex flex-col gap-4 h-full overflow-y-auto p-4 border border-slate-300 rounded-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl text-slate-600 font-semibold">Latest Data</h2>
                    <span className="text-xs font-mono text-slate-500">{formatTime(sample.unix_time)}</span>
                </div>

                {/* Water quality section */}
                <section>
                    <h3 className="text-xs uppercase tracking-widest text-water-500 mb-2">Water Quality</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <StatCard label="Temperature" value={fmt(sample.water_temp, 1, "°C")} />
                        <StatCard
                            label="Turbidity"
                            value={fmt(sample.turbidity, 2, " NTU")}
                            note={turb.text}
                            noteColor={turb.color}
                        />
                        <StatCard
                            label="TDS"
                            value={fmt(sample.tds, 0, " ppm")}
                            note={tds.text}
                            noteColor={tds.color}
                        />
                    </div>
                </section>

                {/* Air / environment section */}
                <section>
                    <h3 className="text-xs uppercase tracking-widest text-forest-400 mb-2">Atmosphere</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <StatCard label="Air Temp" value={fmt(sample.air_temp, 1, "°C")} />
                        <StatCard label="Humidity" value={fmt(sample.humidity, 0, "%")} />
                        <StatCard label="Pressure" value={fmt(sample.baro, 1, " hPa")} />
                        <StatCard label="Wind Speed" value={fmt(sample.air_velocity, 1, " m/s")} />
                        <StatCard label="UV Index" value={fmt(sample.uv, 1)} />
                        <StatCard label="Luminance" value={fmt(sample.lum, 0, " lux")} />
                    </div>
                </section>

                {/* Particulates section */}
                <section>
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Particulates</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <StatCard label="PM1.0" value={fmt(sample.pm1_0, 1, " µg/m³")} />
                        <StatCard label="PM2.5" value={fmt(sample.pm2_5, 1, " µg/m³")} />
                        <StatCard label="PM10" value={fmt(sample.pm10, 1, " µg/m³")} />
                    </div>
                </section>

                {/* Ozone */}
                <section>
                    <div className="grid grid-cols-1 gap-2">
                        <StatCard label="Ozone" value={fmt(sample.ozone, 4, " ppm")} />
                    </div>
                </section>
            </div>
        </div>
    );
}
