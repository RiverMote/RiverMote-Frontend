import type { SensorHealth } from "@/types";
import { formatRelative } from "@/lib/format";
import { SENSOR_KEYS } from "@/elements/console/sensorKeys";

export default function HealthRow({ health, label }: { health: SensorHealth; label: string }) {
    return (
        <tr className="border-b border-white/5">
            <td className="py-3 px-4 text-sm text-slate-500">{label}</td>
            <td className="py-3 px-4 text-xs font-mono text-slate-500">{health.endpoint}</td>
            {SENSOR_KEYS.map(({ key, label: sensorLabel }) => {
                const ok = health[key] === 1;
                return (
                    <td key={sensorLabel} className="py-3 px-4 text-center">
                        <span
                            className={`status-dot ${ok ? "status-ok" : "status-err"}`}
                            title={ok ? `${sensorLabel}: OK` : `${sensorLabel}: FAULT`}
                        />
                    </td>
                );
            })}
            <td className="py-3 px-4 text-xs text-slate-500">{formatRelative(health.updated_at)}</td>
        </tr>
    );
}
