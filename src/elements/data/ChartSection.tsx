import { useMemo, type ReactNode } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Sample } from "@/types";
import { formatShortTime, formatTime } from "@/lib/format";
import CustomChart from "@/elements/data/CustomChart";
import { AXIS_TICK, buildTimeTicks, X_AXIS_PROPS } from "@/elements/data/charts";
import { formatMetricValue, metricLookup, MetricKey } from "@/elements/data/metrics";

interface ChartSectionProps {
    samples: Sample[];
    units: "metric" | "imperial";
    loading?: boolean;
}

function ChartCard({ title, loading = false, children }: { title: string; loading?: boolean; children?: ReactNode }) {
    return (
        <div className={`panel p-4 overflow-hidden ${loading ? "loading-sheen" : ""}`} aria-busy={loading}>
            <h3 className="text-lg text-slate-500 font-medium mb-3">{title}</h3>
            <div className="h-48">{children}</div>
        </div>
    );
}

export default function ChartSection({ samples, units, loading = false }: ChartSectionProps) {
    const ordered = useMemo(() => [...samples].reverse(), [samples]);
    const chartData = useMemo(
        () =>
            ordered.map(s => ({
                unixTime: s.unix_time,
                water_temp: s.water_temp,
                turbidity: s.turbidity,
                tds: s.tds,
                ozone: s.ozone,
                air_temp: s.air_temp,
                humidity: s.humidity,
                air_velocity: s.air_velocity,
                air_velocity_peak: s.air_velocity_peak,
                baro: s.baro,
                uv: s.uv,
                lum: s.lum,
                pm1_0: s.pm1_0,
                pm2_5: s.pm2_5,
                pm10: s.pm10,
            })),
        [ordered],
    );
    const metrics = metricLookup(units);

    const xTicks = useMemo(() => buildTimeTicks(chartData), [chartData]);
    const xTickLabels = useMemo(() => new Map(xTicks.map(value => [value, formatShortTime(value)])), [xTicks]);

    const hasData = chartData.length > 0;
    if (!hasData && !loading) {
        return null;
    }

    // Custom formatters for graph elements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tooltipLabelFormatter = (value: any) => formatTime(value as number);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
    const tooltipValueFormatter = (value: any, name: any, props: any) => [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        formatMetricValue(props?.dataKey as MetricKey, units, value as number),
        name,
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <ChartCard title="Water Quality" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis
                                {...X_AXIS_PROPS}
                                ticks={xTicks}
                                tickFormatter={(value: number) => xTickLabels.get(value) ?? ""}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("water_temp", units, value as number, true)}
                                domain={["dataMin - 2", "dataMax + 2"]}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("tds", units, value as number, true)}
                            />
                            <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="water_temp"
                                name={metrics.water_temp.label}
                                stroke={metrics.water_temp.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="tds"
                                name={metrics.tds.label}
                                stroke={metrics.tds.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="turbidity"
                                name={metrics.turbidity.label}
                                stroke={metrics.turbidity.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="Weather" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis
                                {...X_AXIS_PROPS}
                                ticks={xTicks}
                                tickFormatter={(value: number) => xTickLabels.get(value) ?? ""}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("air_temp", units, value as number, true)}
                                domain={["dataMin - 2", "dataMax + 2"]}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("baro", units, value as number, true)}
                                tickCount={4}
                                domain={units === "metric" ? [990, 1040] : [29.2, 30.4]} // Fixed hPa, inHg domains to better display high/low pressures
                                allowDataOverflow
                            />
                            <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="air_temp"
                                name={metrics.air_temp.label}
                                stroke={metrics.air_temp.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            {/* Humidity uses the background scale instead of an axis scale because its scale is already easy to interpret (from 0-100) */}
                            <Line
                                type="monotone"
                                dataKey="humidity"
                                name={metrics.humidity.label}
                                stroke={metrics.humidity.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="baro"
                                name={metrics.baro.label}
                                stroke={metrics.baro.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="Atmosphere" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis
                                {...X_AXIS_PROPS}
                                ticks={xTicks}
                                tickFormatter={(value: number) => xTickLabels.get(value) ?? ""}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("air_velocity", units, value as number, true)}
                            />
                            <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />
                            <Legend />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="air_velocity"
                                name={metrics.air_velocity.label}
                                stroke={metrics.air_velocity.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="air_velocity_peak"
                                name={metrics.air_velocity_peak.label}
                                stroke={metrics.air_velocity_peak.color}
                                dot={false}
                                strokeDasharray="4 6"
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="Sunlight" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis
                                {...X_AXIS_PROPS}
                                ticks={xTicks}
                                tickFormatter={(value: number) => xTickLabels.get(value) ?? ""}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("uv", units, value as number, true)}
                                tickCount={4}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("lum", units, value as number, true)}
                            />
                            <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="uv"
                                name={metrics.uv.label}
                                stroke={metrics.uv.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="lum"
                                name={metrics.lum.label}
                                stroke={metrics.lum.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="Air Quality" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis
                                {...X_AXIS_PROPS}
                                ticks={xTicks}
                                tickFormatter={(value: number) => xTickLabels.get(value) ?? ""}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("pm2_5", units, value as number, true)}
                                tickCount={4}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={AXIS_TICK}
                                tickFormatter={value => formatMetricValue("ozone", units, value as number)}
                                tickCount={4}
                            />
                            <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pm1_0"
                                name={metrics.pm1_0.label}
                                stroke={metrics.pm1_0.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pm2_5"
                                name={metrics.pm2_5.label}
                                stroke={metrics.pm2_5.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pm10"
                                name={metrics.pm10.label}
                                stroke={metrics.pm10.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="ozone"
                                name={metrics.ozone.label}
                                stroke={metrics.ozone.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <CustomChart samples={samples} units={units} />
        </div>
    );
}
