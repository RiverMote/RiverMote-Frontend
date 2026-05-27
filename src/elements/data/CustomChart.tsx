import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Sample } from "@/types";
import { formatShortTime, formatTime } from "@/lib/format";
import { formatMetricValue, METRIC_LOOKUP, METRIC_OPTIONS, type MetricKey } from "@/elements/data/metrics";

export default function CustomChart({ samples }: { samples: Sample[] }) {
    const [primaryMetric, setPrimaryMetric] = useState<MetricKey>("battery_v");
    const [secondaryMetric, setSecondaryMetric] = useState<MetricKey>("battery_pct");

    const ordered = useMemo(() => [...samples].reverse(), [samples]);
    const customData = useMemo(() => {
        return ordered.map(sample => {
            const entry: Record<string, number | null> = { unixTime: sample.unix_time };
            METRIC_OPTIONS.forEach(option => {
                entry[option.key] = sample[option.key];
            });
            return entry;
        });
    }, [ordered]);

    const primaryOption = METRIC_LOOKUP[primaryMetric];
    const secondaryOption = METRIC_LOOKUP[secondaryMetric];

    return (
        <div className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs text-slate-500">
                <label className="flex items-center gap-2">
                    <span>Line A</span>
                    <select
                        value={primaryMetric}
                        onChange={event => setPrimaryMetric(event.target.value as MetricKey)}
                        className="bg-slate-300/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-600"
                    >
                        {METRIC_OPTIONS.map(option => (
                            <option key={option.key} value={option.key}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    <span>Line B</span>
                    <select
                        value={secondaryMetric}
                        onChange={event => setSecondaryMetric(event.target.value as MetricKey)}
                        className="bg-slate-300/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-600"
                    >
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
            ) : (
                <div className="h-55">
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={customData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                            <XAxis
                                dataKey="unixTime"
                                tick={{ fill: "#64748b", fontSize: 11 }}
                                interval="preserveStartEnd"
                                type="number"
                                domain={["dataMin", "dataMax"]}
                                scale="time"
                                tickFormatter={(value: number) => formatShortTime(value)}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fill: "#64748b", fontSize: 11 }}
                                tickFormatter={value => formatMetricValue(primaryOption.key, value as number)}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fill: "#64748b", fontSize: 11 }}
                                tickFormatter={value => formatMetricValue(secondaryOption.key, value as number)}
                            />
                            <Tooltip
                                labelFormatter={value => formatTime(value as number)}
                                formatter={(value, name, props) => [
                                    formatMetricValue(props.dataKey as MetricKey, value as number),
                                    name,
                                ]}
                            />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey={primaryMetric}
                                name={primaryOption?.label ?? "Line A"}
                                stroke={primaryOption?.color ?? "#0f766e"}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey={secondaryMetric}
                                name={secondaryOption?.label ?? "Line B"}
                                stroke={secondaryOption?.color ?? "#2563eb"}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
