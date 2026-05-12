// ---------------------------------------------------------------------------
// API response types — mirrors the backend DB schema exactly
// ---------------------------------------------------------------------------

export interface Device {
    endpoint: string;
    last_seen: number;
}

export interface Sample {
    id: number;
    endpoint: string;
    unix_time: number;
    millis: number | null;
    battery_v: number | null;
    battery_pct: number | null;
    vbus_v: number | null;
    charging: 0 | 1;
    water_temp: number | null;
    turbidity: number | null;
    tds: number | null;
    air_temp: number | null;
    humidity: number | null;
    air_velocity: number | null;
    ozone: number | null;
    uv: number | null;
    lum: number | null;
    baro: number | null;
    pm1_0: number | null;
    pm2_5: number | null;
    pm10: number | null;
    created_at: number;
}

export interface Command {
    id: number;
    endpoint: string;
    cmd: string;
    payload: string | null;
    status: "pending" | "sent" | "acked";
    created_at: number;
    sent_at: number | null;
    ack_at: number | null;
}

export interface SensorHealth {
    endpoint: string;
    unix_time: number;
    temperature: 0 | 1;
    turbidity: 0 | 1;
    tds: 0 | 1;
    environmental: 0 | 1;
    ozone: 0 | 1;
    air_velocity: 0 | 1;
    particulate_matter: 0 | 1;
    updated_at: number;
}

// ---------------------------------------------------------------------------
// UI-only types
// ---------------------------------------------------------------------------

// Known lat/lng positions for each endpoint — configured manually since the
// backend doesn't store device locations
export interface DeviceLocation {
    endpoint: string;
    label: string;
    lat: number;
    lng: number;
}

// Fields from Sample that are relevant to the public data page
// (excludes internal power/admin fields)
export interface PublicMetrics {
    water_temp: number | null;
    turbidity: number | null;
    tds: number | null;
    air_temp: number | null;
    humidity: number | null;
    air_velocity: number | null;
    ozone: number | null;
    uv: number | null;
    lum: number | null;
    baro: number | null;
    pm1_0: number | null;
    pm2_5: number | null;
    pm10: number | null;
}
