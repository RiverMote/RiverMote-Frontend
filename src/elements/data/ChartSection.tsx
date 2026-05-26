import { useMemo, type ReactNode } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Sample } from "@/types";
import { formatShortTime, formatTime } from "@/lib/format";
import CustomChart from "@/elements/data/CustomChart";
import { METRIC_LOOKUP } from "@/elements/data/metrics";

interface ChartSectionProps {
    samples: Sample[];
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

export default function ChartSection({ samples, loading = false }: ChartSectionProps) {
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
                baro: s.baro,
                uv: s.uv,
                lum: s.lum,
                pm1_0: s.pm1_0,
                pm2_5: s.pm2_5,
                pm10: s.pm10,
            })),
        [ordered],
    );

    const hasData = chartData.length > 0;
    if (!hasData && !loading) {
        return null;
    }

    const axisTick = { fill: "#64748b", fontSize: 11 };
    const xAxisProps = {
        dataKey: "unixTime",
        tick: axisTick,
        interval: "preserveStartEnd" as const,
        type: "number" as const,
        domain: ["dataMin", "dataMax"] as const,
        scale: "time" as const,
        tickFormatter: (value: number) => formatShortTime(value),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tooltipLabelFormatter = (value: any) => formatTime(value as number);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <ChartCard title="Temperature" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis {...xAxisProps} />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip labelFormatter={tooltipLabelFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="water_temp"
                                name={METRIC_LOOKUP.water_temp.label}
                                stroke={METRIC_LOOKUP.water_temp.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="air_temp"
                                name={METRIC_LOOKUP.air_temp.label}
                                stroke={METRIC_LOOKUP.air_temp.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="humidity"
                                name={METRIC_LOOKUP.humidity.label}
                                stroke={METRIC_LOOKUP.humidity.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="Water Quality" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis {...xAxisProps} />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip labelFormatter={tooltipLabelFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="tds"
                                name={METRIC_LOOKUP.tds.label}
                                stroke={METRIC_LOOKUP.tds.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="turbidity"
                                name={METRIC_LOOKUP.turbidity.label}
                                stroke={METRIC_LOOKUP.turbidity.color}
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
                            <XAxis {...xAxisProps} />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip labelFormatter={tooltipLabelFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="air_velocity"
                                name={METRIC_LOOKUP.air_velocity.label}
                                stroke={METRIC_LOOKUP.air_velocity.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="baro"
                                name={METRIC_LOOKUP.baro.label}
                                stroke={METRIC_LOOKUP.baro.color}
                                dot={false}
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
                            <XAxis {...xAxisProps} />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip labelFormatter={tooltipLabelFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="uv"
                                name={METRIC_LOOKUP.uv.label}
                                stroke={METRIC_LOOKUP.uv.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="lum"
                                name={METRIC_LOOKUP.lum.label}
                                stroke={METRIC_LOOKUP.lum.color}
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
                            <XAxis {...xAxisProps} />
                            <YAxis tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip labelFormatter={tooltipLabelFormatter} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pm1_0"
                                name={METRIC_LOOKUP.pm1_0.label}
                                stroke={METRIC_LOOKUP.pm1_0.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pm2_5"
                                name={METRIC_LOOKUP.pm2_5.label}
                                stroke={METRIC_LOOKUP.pm2_5.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pm10"
                                name={METRIC_LOOKUP.pm10.label}
                                stroke={METRIC_LOOKUP.pm10.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="ozone"
                                name={METRIC_LOOKUP.ozone.label}
                                stroke={METRIC_LOOKUP.ozone.color}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <CustomChart samples={samples} />
        </div>
    );
}
