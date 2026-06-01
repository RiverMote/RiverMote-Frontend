import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Sample } from "@/types";
import { formatShortTime, formatTime } from "@/lib/format";
import { AXIS_TICK, buildTimeTicks, X_AXIS_PROPS } from "@/elements/data/charts";
import { formatMetricValue, metricLookup, METRIC_OPTIONS, type MetricKey } from "@/elements/data/metrics";

export default function CustomChart({ samples, units }: { samples: Sample[]; units: "metric" | "imperial" }) {
    const [primaryMetric, setPrimaryMetric] = useState<MetricKey | "">("");
    const [secondaryMetric, setSecondaryMetric] = useState<MetricKey | "">("");

    const ordered = useMemo(() => [...samples].reverse(), [samples]);
    const customData = useMemo(() => {
        return ordered.map(sample => {
            const entry: Record<string, number | null> & { unixTime: number } = { unixTime: sample.unix_time };
            METRIC_OPTIONS.forEach(option => {
                entry[option.key] = sample[option.key];
            });
            return entry;
        });
    }, [ordered]);

    const xTicks = useMemo(() => buildTimeTicks(customData), [customData]);
    const xTickLabels = useMemo(() => new Map(xTicks.map(value => [value, formatShortTime(value)])), [xTicks]);
    const metrics = metricLookup(units);
    const primaryOption = primaryMetric ? metrics[primaryMetric] : null;
    const secondaryOption = secondaryMetric ? metrics[secondaryMetric] : null;

    return (
        <div className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs text-slate-500">
                <label className="flex items-center gap-2">
                    <span>Metric A</span>
                    <select
                        value={primaryMetric}
                        onChange={event => setPrimaryMetric(event.target.value as MetricKey | "")}
                        className="bg-slate-300/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-600"
                    >
                        <option value="">Choose...</option>
                        {METRIC_OPTIONS.map(option => (
                            <option key={option.key} value={option.key}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    <span>Metric B</span>
                    <select
                        value={secondaryMetric}
                        onChange={event => setSecondaryMetric(event.target.value as MetricKey | "")}
                        className="bg-slate-300/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-600"
                    >
                        <option value="">Choose...</option>
                        {METRIC_OPTIONS.map(option => (
                            <option key={option.key} value={option.key}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {customData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                    No data for this device
                </div>
            ) : !primaryOption && !secondaryOption ? (
                <div className="flex items-center justify-center h-55 text-slate-600 text-sm">Choose data to plot</div>
            ) : (
                <div className="h-55">
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={customData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                            <XAxis
                                {...X_AXIS_PROPS}
                                ticks={xTicks}
                                tickFormatter={(value: number) => xTickLabels.get(value) ?? ""}
                            />
                            {primaryOption ? (
                                <YAxis
                                    yAxisId="left"
                                    tick={AXIS_TICK}
                                    tickFormatter={value =>
                                        formatMetricValue(primaryOption.key, units, value as number)
                                    }
                                />
                            ) : null}
                            {secondaryOption ? (
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={AXIS_TICK}
                                    tickFormatter={value =>
                                        formatMetricValue(secondaryOption.key, units, value as number)
                                    }
                                />
                            ) : null}
                            {primaryOption || secondaryOption ? (
                                <Tooltip
                                    labelFormatter={value => formatTime(value as number)}
                                    formatter={(value, name, props) => [
                                        formatMetricValue(props.dataKey as MetricKey, units, value as number),
                                        name,
                                    ]}
                                />
                            ) : null}
                            {primaryOption || secondaryOption ? <Legend /> : null}
                            {primaryOption ? (
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey={primaryMetric}
                                    name={primaryOption.label}
                                    stroke={primaryOption.color}
                                    dot={false}
                                />
                            ) : null}
                            {secondaryOption ? (
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey={secondaryMetric}
                                    name={secondaryOption.label}
                                    stroke={secondaryOption.color}
                                    dot={false}
                                />
                            ) : null}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
