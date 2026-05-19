import { useState } from "react";
import { setDeviceInfo } from "@/lib/api";
import type { Device } from "@/types";

export default function DeviceInfoPanel({ device, onSaved }: { device: Device | null; onSaved: () => void }) {
    const [name, setName] = useState(() => device?.name ?? "");
    const [lat, setLat] = useState(() => (device?.lat === null ? "" : String(device!.lat)));
    const [lng, setLng] = useState(() => (device?.lng === null ? "" : String(device!.lng)));
    const [status, setStatus] = useState("");

    async function save() {
        if (!device) {
            return;
        }
        const trimmedName = name.trim();
        if (!trimmedName) {
            setStatus("Name required");
            return;
        }
        const latValue = lat.trim() === "" ? null : Number(lat);
        if (latValue !== null && Number.isNaN(latValue)) {
            setStatus("Invalid latitude");
            return;
        }
        const lngValue = lng.trim() === "" ? null : Number(lng);
        if (lngValue !== null && Number.isNaN(lngValue)) {
            setStatus("Invalid longitude");
            return;
        }
        setStatus("Saving…");
        try {
            await setDeviceInfo({
                endpoint: device.endpoint,
                name: trimmedName,
                lat: latValue,
                lng: lngValue,
            });
            setStatus("✓ Saved");
            onSaved();
        } catch {
            setStatus("✗ Failed");
        }
    }

    return (
        <div className="panel p-4 flex flex-col gap-3">
            <h3 className="text-xl text-slate-600 font-semibold">Device Info</h3>
            <div className="flex flex-col gap-2">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    className="bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        value={lat}
                        onChange={e => setLat(e.target.value)}
                        placeholder="Latitude"
                        className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                    <input
                        value={lng}
                        onChange={e => setLng(e.target.value)}
                        placeholder="Longitude"
                        className="flex-1 bg-slate-300/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => void save()}
                    className="px-4 py-2 rounded-lg bg-forest-600 hover:bg-forest-500 text-white text-sm transition-colors"
                    disabled={!device}
                >
                    Save
                </button>
                {status && <p className="text-xs text-slate-400">{status}</p>}
            </div>
        </div>
    );
}
