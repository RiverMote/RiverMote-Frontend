import { useMemo, type ReactNode } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Sample } from "@/types";
import { formatShortTime } from "@/lib/format";

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
                time: formatShortTime(s.unix_time),
                waterTemp: s.water_temp,
                turbidity: s.turbidity,
                tds: s.tds,
                ozone: s.ozone,
                airTemp: s.air_temp,
                humidity: s.humidity,
                pm1: s.pm1_0,
                pm25: s.pm2_5,
                pm10: s.pm10,
            })),
        [ordered],
    );

    const hasData = chartData.length > 0;
    if (!hasData && !loading) {
        return null;
    }

    const axisTick = { fill: "#64748b", fontSize: 11 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <ChartCard title="Water Quality" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis dataKey="time" tick={axisTick} interval="preserveStartEnd" />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="waterTemp"
                                name="Water Temp (°C)"
                                stroke="#0ea5e9"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="turbidity"
                                name="Turbidity (NTU)"
                                stroke="#f59e0b"
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="TDS & Ozone" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis dataKey="time" tick={axisTick} interval="preserveStartEnd" />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="tds"
                                name="TDS (ppm)"
                                stroke="#34d399"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="ozone"
                                name="Ozone (ppm)"
                                stroke="#a78bfa"
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
                            <XAxis dataKey="time" tick={axisTick} interval="preserveStartEnd" />
                            <YAxis yAxisId="left" tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="airTemp"
                                name="Air Temp (°C)"
                                stroke="#f87171"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="humidity"
                                name="Humidity (%)"
                                stroke="#60a5fa"
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            <ChartCard title="Particulates" loading={loading}>
                {hasData && (
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(15, 23, 42, 0.1)" vertical={false} />
                            <XAxis dataKey="time" tick={axisTick} interval="preserveStartEnd" />
                            <YAxis tick={axisTick} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="pm1"
                                name="PM1.0"
                                stroke="#c084fc"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="pm25"
                                name="PM2.5"
                                stroke="#e879f9"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="pm10"
                                name="PM10"
                                stroke="#f472b6"
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>
        </div>
    );
}
