import { useEffect, useState } from "react";
import { fetchCommands, postCommand } from "@/lib/api";
import { formatShortTime } from "@/lib/format";
import { POLLING } from "@/lib/polling";
import type { Command } from "@/types";

type CommandType = "reboot" | "ota" | "set_slot";

export default function CommandPanel({ endpoint }: { endpoint: string }) {
    const [command, setCommand] = useState<CommandType>("reboot");
    const [otaServer, setOtaServer] = useState("rivermote.org");
    const [otaPath, setOtaPath] = useState("/firmware.bin");
    const [slotSeconds, setSlotSeconds] = useState("");
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
        setStatus("Sending…");
        try {
            if (command === "ota") {
                const server = otaServer.trim();
                const path = otaPath.trim();
                if (!server || !path) {
                    setStatus("Enter server and path");
                    return;
                }
                const res = await postCommand(endpoint, "ota", { server, path });
                setStatus(res.sent ? "✓ Sent" : "✓ Queued");
                void loadCommands();
                return;
            }
            if (command === "set_slot") {
                const secondsValue = Number(slotSeconds);
                if (!Number.isInteger(secondsValue)) {
                    setStatus("Enter an integer number of seconds");
                    return;
                }
                const res = await postCommand(endpoint, "set_slot", { seconds: secondsValue });
                setStatus(res.sent ? "✓ Sent" : "✓ Queued");
                void loadCommands();
                return;
            }
            const res = await postCommand(endpoint, "reboot");
            setStatus(res.sent ? "✓ Sent" : "✓ Queued");
            void loadCommands();
        } catch {
            setStatus("✗ Failed");
        }
    }

    return (
        <div className="panel p-4 flex flex-col gap-4">
            <h3 className="text-xl text-slate-600 font-semibold">Send Command</h3>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <select
                        value={command}
                        onChange={e => setCommand(e.target.value as CommandType)}
                        className="bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                    >
                        <option value="reboot">reboot</option>
                        <option value="ota">ota</option>
                        <option value="set_slot">set_slot</option>
                    </select>
                    <button
                        onClick={() => void send()}
                        className="px-4 py-2 rounded-lg bg-forest-600 hover:bg-forest-500 text-white text-sm transition-colors"
                    >
                        Send
                    </button>
                </div>

                {command === "ota" && (
                    <div className="flex flex-col md:flex-row gap-2">
                        <input
                            value={otaServer}
                            onChange={e => setOtaServer(e.target.value)}
                            placeholder="Server"
                            className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                        <input
                            value={otaPath}
                            onChange={e => setOtaPath(e.target.value)}
                            placeholder="Path"
                            className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                    </div>
                )}
                {command === "set_slot" && (
                    <div className="flex flex-col md:flex-row gap-2">
                        <input
                            value={slotSeconds}
                            onChange={e => setSlotSeconds(e.target.value)}
                            placeholder="Seconds"
                            className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                    </div>
                )}
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
                                <tr key={c.id} className="border-b border-white/5 text-slate-500">
                                    <td className="py-2 px-3">{formatShortTime(c.created_at)}</td>
                                    <td className="py-2 px-3">{c.cmd}</td>
                                    <td className="py-2 px-3 text-slate-500">{c.payload ?? "—"}</td>
                                    <td className="py-2 px-3">
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-xs ${
                                                c.status === "acked"
                                                    ? "bg-green-300/50 text-forest-400"
                                                    : c.status === "sent"
                                                      ? "bg-sky-300/50 text-blue-400"
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
