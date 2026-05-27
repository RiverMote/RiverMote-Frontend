// API response types

export interface Device {
    endpoint: string;
    last_seen: number | null;
    name: string;
    lat: number | null;
    lng: number | null;
}

export interface Sample {
    id: number;
    endpoint: string;
    unix_time: number;
    millis: number | null;
    battery_v: number | null;
    battery_pct: number | null;
    water_temp: number | null;
    turbidity: number | null;
    tds: number | null;
    air_temp: number | null;
    humidity: number | null;
    air_velocity: number | null;
    air_velocity_peak: number | null;
    ozone: number | null;
    uv: number | null;
    lum: number | null;
    baro: number | null;
    pm1_0: number | null;
    pm2_5: number | null;
    pm10: number | null;
    chamber_temp: number | null;
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
    chamber_temp: 0 | 1;
    updated_at: number;
}
