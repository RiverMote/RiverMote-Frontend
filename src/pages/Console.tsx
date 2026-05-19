import { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { auth, fetchHealth, fetchDevices } from "@/lib/api";
import { useSamples } from "@/hooks/useSamples";
import { fmt, formatTime, formatShortTime, formatRelative } from "@/lib/format";
import { POLLING } from "@/lib/polling";
import type { Device, SensorHealth } from "@/types";
import CommandPanel from "@/elements/console/CommandPanel";
import DeviceInfoPanel from "@/elements/console/DeviceInfoPanel";
import HealthRow from "@/elements/console/HealthRow";
import { SENSOR_KEYS } from "@/elements/console/sensorKeys";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function Console() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState<Device[]>([]);
    const [health, setHealth] = useState<SensorHealth[]>([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

    const deviceMap = useMemo(() => new Map(devices.map(device => [device.endpoint, device])), [devices]);

    // Poll device list and health every 30 seconds
    useEffect(() => {
        async function load() {
            const [devs, h] = await Promise.all([
                fetchDevices().catch(() => [] as Device[]),
                fetchHealth().catch(() => [] as SensorHealth[]),
            ]);
            setDevices(devs);
            setHealth(Array.isArray(h) ? h : [h]);
            if (!selectedEndpoint && devs.length) {
                setSelectedEndpoint(devs[0].endpoint);
            }
        }
        void load();
        const id = setInterval(() => void load(), POLLING.devicesHealthMs);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function refreshDevices() {
        const devs = await fetchDevices().catch(() => [] as Device[]);
        setDevices(devs);
    }

    // Power chart samples for the selected endpoint
    const { samples } = useSamples({
        endpoint: selectedEndpoint,
        limit: 200,
        pollInterval: POLLING.samplesMs,
    });

    const ordered = useMemo(() => [...samples].reverse(), [samples]);
    const powerData = useMemo(
        () =>
            ordered.map(s => ({
                time: formatShortTime(s.unix_time),
                batteryV: s.battery_v,
                batteryPct: s.battery_pct,
            })),
        [ordered],
    );

    function logout() {
        auth.clear();
        void navigate("/console/login");
    }

    return (
        <div className="min-h-screen px-4 md:px-6 py-6">
            {/* Console header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <NavLink to="/" className="text-2xl font-semibold text-forest-400">
                        River <span className="text-water-400">Mote</span>
                    </NavLink>
                    <span className="ml-3 text-sm font-medium text-slate-500">Admin Console</span>
                </div>
                <button onClick={logout} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                    Sign out
                </button>
            </div>

            {/* Sensor health table */}
            <div className="panel mb-6 overflow-x-auto">
                <div className="px-4 pt-4 pb-2">
                    <h2 className="text-xl text-slate-600 font-semibold">Sensor Health</h2>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="text-left py-2 px-4">Station</th>
                            <th className="text-left py-2 px-4">Endpoint</th>
                            {SENSOR_KEYS.map(s => (
                                <th key={s.key} className="py-2 px-4 text-center">
                                    {s.label}
                                </th>
                            ))}
                            <th className="text-left py-2 px-4">Reported</th>
                        </tr>
                    </thead>
                    <tbody>
                        {health.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={SENSOR_KEYS.length + 3}
                                    className="text-center py-8 text-slate-600 text-sm"
                                >
                                    No health reports received yet
                                </td>
                            </tr>
                        ) : (
                            health.map(h => (
                                <HealthRow
                                    key={h.endpoint}
                                    health={h}
                                    label={deviceMap.get(h.endpoint)?.name ?? h.endpoint}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Device selector + command panel + power chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: device picker + commands */}
                <div className="flex flex-col gap-4">
                    {/* Device selector */}
                    <div className="panel p-4 flex items-center gap-3">
                        <label className="text-xs text-slate-500 uppercase tracking-wider shrink-0">Device</label>
                        <select
                            value={selectedEndpoint ?? ""}
                            onChange={e => setSelectedEndpoint(e.target.value)}
                            className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                        >
                            {devices.map(d => (
                                <option key={d.endpoint} value={d.endpoint}>
                                    {d.name || d.endpoint} ({d.endpoint}) —
                                    {d.last_seen ? ` ${formatRelative(d.last_seen)}` : " never"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Latest values for selected device (admin view — includes power fields) */}
                    {samples[0] && (
                        <div className="panel p-4">
                            <h3 className="text-xl text-slate-600 font-semibold mb-3">Latest Sample</h3>
                            <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-500">
                                <div>
                                    🔋 {fmt(samples[0].battery_v, 2, " V")} / {fmt(samples[0].battery_pct, 0, "%")}
                                </div>
                                <div className="text-slate-500 col-span-3">{formatTime(samples[0].unix_time)}</div>
                            </div>
                        </div>
                    )}

                    {selectedEndpoint && (
                        <DeviceInfoPanel
                            key={selectedEndpoint}
                            device={deviceMap.get(selectedEndpoint) ?? null}
                            onSaved={() => void refreshDevices()}
                        />
                    )}

                    {selectedEndpoint && <CommandPanel endpoint={selectedEndpoint} />}
                </div>

                {/* Right: power chart */}
                <div className="panel p-5">
                    <h3 className="text-xl text-slate-600 font-semibold mb-3">Power</h3>
                    {powerData.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                            No data for this device
                        </div>
                    ) : (
                        <div className="h-55">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                initialDimension={{ width: 100, height: 50 }}
                            >
                                <LineChart data={powerData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                                    <CartesianGrid stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
                                    <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        domain={[0, 100]}
                                        tick={{ fill: "#64748b", fontSize: 11 }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="batteryV"
                                        name="Battery V"
                                        stroke="#0f766e"
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="batteryPct"
                                        name="Battery %"
                                        stroke="#2563eb"
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
