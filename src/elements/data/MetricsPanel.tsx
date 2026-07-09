import { useRef } from "react";
import type { Sample } from "@/types";
import { formatTime } from "@/lib/format";
import { formatMetricValue, metricLookup } from "@/elements/data/metrics";
import * as labels from "@/elements/data/metricsLabels";
import StatCard from "@/elements/ui/StatCard";

interface MetricsPanelProps {
    mode: "live" | "historical";
    sample: Sample | null;
    units: "metric" | "imperial";
    loading: boolean;
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

    const metrics = metricLookup(units, false);
    const turb = labels.turbidity(sample.turbidity);
    const tds = labels.tds(sample.tds);
    const ozone = labels.ozone(sample.ozone);
    const pm1_0 = labels.pm1_25(sample.pm1_0);
    const pm2_5 = labels.pm1_25(sample.pm2_5);
    const pm10 = labels.pm10(sample.pm10);
    const voc = labels.voc(sample.voc);
    const co2 = labels.co2(sample.co2);
    const aqi = labels.aqi(sample.aqi);

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
                            label={metrics.water_temp.label}
                            value={formatMetricValue("water_temp", units, sample.water_temp)}
                        />
                        <StatCard
                            label={metrics.turbidity.label}
                            value={formatMetricValue("turbidity", units, sample.turbidity)}
                            note={turb.text}
                            noteColor={turb.color}
                        />
                        <StatCard
                            label={metrics.tds.label}
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
                        <StatCard
                            label={metrics.air_temp.label}
                            value={formatMetricValue("air_temp", units, sample.air_temp)}
                        />
                        <StatCard
                            label={metrics.humidity.label}
                            value={formatMetricValue("humidity", units, sample.humidity)}
                        />
                        <StatCard label={metrics.baro.label} value={formatMetricValue("baro", units, sample.baro)} />
                        <StatCard label={metrics.alt.label} value={formatMetricValue("alt", units, sample.alt)} />
                        <StatCard label={metrics.uv.label} value={formatMetricValue("uv", units, sample.uv)} />
                        <StatCard
                            label={metrics.air_velocity.label}
                            value={formatMetricValue("air_velocity", units, sample.air_velocity)}
                        />
                    </div>
                </section>

                {/* Air quality section */}
                <section className="border border-slate-400 rounded-lg p-3">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Air Quality</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <StatCard
                            label={metrics.pm1_0.label}
                            value={formatMetricValue("pm1_0", units, sample.pm1_0)}
                            note={pm1_0.text}
                            noteColor={pm1_0.color}
                        />
                        <StatCard
                            label={metrics.pm2_5.label}
                            value={formatMetricValue("pm2_5", units, sample.pm2_5)}
                            note={pm2_5.text}
                            noteColor={pm2_5.color}
                        />
                        <StatCard
                            label={metrics.pm10.label}
                            value={formatMetricValue("pm10", units, sample.pm10)}
                            note={pm10.text}
                            noteColor={pm10.color}
                        />
                        <StatCard
                            label={metrics.ozone.label}
                            value={formatMetricValue("ozone", units, sample.ozone)}
                            note={ozone.text}
                            noteColor={ozone.color}
                        />
                        <StatCard
                            label={metrics.voc.label}
                            value={formatMetricValue("voc", units, sample.voc)}
                            note={voc.text}
                            noteColor={voc.color}
                        />
                        <StatCard
                            label={metrics.co2.label}
                            value={formatMetricValue("co2", units, sample.co2)}
                            note={co2.text}
                            noteColor={co2.color}
                        />
                        <StatCard
                            label={metrics.aqi.label}
                            value={formatMetricValue("aqi", units, sample.aqi)}
                            note={aqi.text}
                            noteColor={aqi.color}
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
