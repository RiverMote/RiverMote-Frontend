import { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { auth, fetchHealth, fetchDevices, fetchCommands, postCommand } from "@/lib/api";
import { useSamples } from "@/hooks/useSamples";
import { getDeviceLocation } from "@/lib/devices";
import { fmt, formatTime, formatShortTime, formatRelative } from "@/lib/format";
import { POLLING } from "@/lib/polling";
import type { Device, SensorHealth, Command } from "@/types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

/* Sensor health table row */

const SENSOR_KEYS: Array<{ key: keyof SensorHealth; label: string }> = [
    { key: "temperature", label: "Water Temp" },
    { key: "turbidity", label: "Turbidity" },
    { key: "tds", label: "TDS" },
    { key: "environmental", label: "Environment" },
    { key: "ozone", label: "Ozone" },
    { key: "air_velocity", label: "Air Velocity" },
    { key: "particulate_matter", label: "Particulates" },
];

function HealthRow({ health }: { health: SensorHealth }) {
    const loc = getDeviceLocation(health.endpoint);
    return (
        <tr className="border-b border-white/5">
            <td className="py-3 px-4 text-sm text-slate-500">{loc.label}</td>
            <td className="py-3 px-4 text-xs font-mono text-slate-500">{health.endpoint}</td>
            {SENSOR_KEYS.map(({ key, label }) => {
                const ok = health[key] === 1;
                return (
                    <td key={label} className="py-3 px-4 text-center">
                        <span
                            className={`status-dot ${ok ? "status-ok" : "status-err"}`}
                            title={ok ? `${label}: OK` : `${label}: FAULT`}
                        />
                    </td>
                );
            })}
            <td className="py-3 px-4 text-xs text-slate-500">{formatRelative(health.updated_at)}</td>
        </tr>
    );
}

/* Command panel */

function CommandPanel({ endpoint }: { endpoint: string }) {
    const [cmd, setCmd] = useState("");
    const [payload, setPayload] = useState("");
    const [status, setStatus] = useState("");
    const [commands, setCommands] = useState<Command[]>([]);

    async function loadCommands() {
        try {
            const data = await fetchCommands(endpoint, "active", "all");
            setCommands(data);
        } catch {
            // silently ignore refresh failures
        }
    }

    useEffect(() => {
        // Load commands immediately and on the configured interval
        const initial = setTimeout(() => void loadCommands(), 0);
        const id = setInterval(() => void loadCommands(), POLLING.commandsMs);
        return () => {
            clearTimeout(initial);
            clearInterval(id);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    async function send() {
        if (!cmd.trim()) {
            return;
        }
        setStatus("Sending…");
        try {
            const res = await postCommand(endpoint, cmd.trim(), payload.trim() || undefined);
            setStatus(res.sent ? "✓ Sent" : "✓ Queued");
            void loadCommands();
        } catch {
            setStatus("✗ Failed");
        }
    }

    return (
        <div className="panel p-4 flex flex-col gap-4">
            <h3 className="text-xl text-slate-600 font-semibold">Send Command</h3>

            <div className="flex gap-2">
                <input
                    value={cmd}
                    onChange={e => setCmd(e.target.value)}
                    placeholder="Command name"
                    className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
                <input
                    value={payload}
                    onChange={e => setPayload(e.target.value)}
                    placeholder="Payload (optional)"
                    className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
                <button
                    onClick={() => void send()}
                    className="px-4 py-2 rounded-lg bg-forest-600 hover:bg-forest-500 text-white text-sm transition-colors"
                >
                    Send
                </button>
            </div>
            {status && <p className="text-xs text-slate-400">{status}</p>}

            {/* Active command queue */}
            {commands.length > 0 && (
                <div className="border border-white/5 rounded-lg overflow-hidden">
                    <table className="w-full text-xs font-mono">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-500">
                                <th className="text-left py-2 px-3">Time</th>
                                <th className="text-left py-2 px-3">Command</th>
                                <th className="text-left py-2 px-3">Payload</th>
                                <th className="text-left py-2 px-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commands.map(c => (
                                <tr key={c.id} className="border-b border-white/5 text-slate-300">
                                    <td className="py-2 px-3">{formatShortTime(c.created_at)}</td>
                                    <td className="py-2 px-3">{c.cmd}</td>
                                    <td className="py-2 px-3 text-slate-500">{c.payload ?? "—"}</td>
                                    <td className="py-2 px-3">
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-xs ${
                                                c.status === "acked"
                                                    ? "bg-green-900/50 text-green-400"
                                                    : c.status === "sent"
                                                      ? "bg-blue-900/50 text-blue-400"
                                                      : "bg-slate-800 text-slate-400"
                                            }`}
                                        >
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* Main console page */

export default function Console() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState<Device[]>([]);
    const [health, setHealth] = useState<SensorHealth[]>([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

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
                solarV: s.vbus_v,
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
                            health.map(h => <HealthRow key={h.endpoint} health={h} />)
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
                                    {getDeviceLocation(d.endpoint).label} ({d.endpoint}) — {formatRelative(d.last_seen)}
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
                                <div>☀️ {fmt(samples[0].vbus_v, 2, " V")}</div>
                                <div>{samples[0].charging ? "⚡ Charging" : "· Not charging"}</div>
                                <div className="text-slate-500 col-span-3">{formatTime(samples[0].unix_time)}</div>
                            </div>
                        </div>
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
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="solarV"
                                        name="Solar V"
                                        stroke="#f59e0b"
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
