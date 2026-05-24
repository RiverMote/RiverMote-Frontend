export type MetricKey =
    | "battery_v"
    | "battery_pct"
    | "water_temp"
    | "turbidity"
    | "tds"
    | "air_temp"
    | "humidity"
    | "air_velocity"
    | "ozone"
    | "uv"
    | "lum"
    | "baro"
    | "pm1_0"
    | "pm2_5"
    | "pm10"
    | "chamber_temp";

export const METRIC_OPTIONS: Array<{ key: MetricKey; label: string; color: string }> = [
    { key: "battery_v", label: "Battery V", color: "#0f766e" },
    { key: "battery_pct", label: "Battery %", color: "#2563eb" },
    { key: "water_temp", label: "Water Temp (°C)", color: "#0ea5e9" },
    { key: "turbidity", label: "Turbidity (NTU)", color: "#f59e0b" },
    { key: "tds", label: "TDS (ppm)", color: "#34d399" },
    { key: "air_temp", label: "Air Temp (°C)", color: "#f87171" },
    { key: "humidity", label: "Humidity (%)", color: "#60a5fa" },
    { key: "air_velocity", label: "Air Velocity (m/s)", color: "#15803d" },
    { key: "ozone", label: "Ozone (ppm)", color: "#22c55e" },
    { key: "uv", label: "UV (mw/cm²)", color: "#f97316" },
    { key: "lum", label: "Luminosity (lx)", color: "#eab308" },
    { key: "baro", label: "Pressure (hPa)", color: "#be123c" },
    { key: "pm1_0", label: "PM1.0 (µg/m³)", color: "#7c3aed" },
    { key: "pm2_5", label: "PM2.5 (µg/m³)", color: "#e879f9" },
    { key: "pm10", label: "PM10 (µg/m³)", color: "#f472b6" },
    { key: "chamber_temp", label: "Chamber Temp (°C)", color: "#fb7185" },
];

export const METRIC_LOOKUP = Object.fromEntries(METRIC_OPTIONS.map(option => [option.key, option])) as Record<
    MetricKey,
    { key: MetricKey; label: string; color: string }
>;
