import { fmt } from "@/lib/format";

// All the metrics we have, derived from a Sample
export type MetricKey =
    | "battery_v"
    | "battery_pct"
    | "water_temp"
    | "turbidity"
    | "tds"
    | "air_temp"
    | "humidity"
    | "air_velocity"
    | "air_velocity_peak"
    | "ozone"
    | "uv"
    | "lum"
    | "baro"
    | "pm1_0"
    | "pm2_5"
    | "pm10"
    | "chamber_temp";

// Each metric has a pretty label, color for charts, and formatting info (decimal places)
export const METRIC_OPTIONS: Array<{
    key: MetricKey;
    label: string;
    color: string;
    decimals: number;
    unit: string;
}> = [
    { key: "battery_v", label: "Battery (V)", color: "#0f766e", decimals: 2, unit: " V" },
    { key: "battery_pct", label: "Battery (%)", color: "#2563eb", decimals: 0, unit: "%" },
    { key: "water_temp", label: "Water Temp (°C)", color: "#0ea5e9", decimals: 1, unit: "°C" },
    { key: "turbidity", label: "Turbidity (NTU)", color: "#f59e0b", decimals: 2, unit: " NTU" },
    { key: "tds", label: "TDS (ppm)", color: "#34d399", decimals: 0, unit: " ppm" },
    { key: "air_temp", label: "Air Temp (°C)", color: "#f87171", decimals: 1, unit: "°C" },
    { key: "humidity", label: "Humidity (%)", color: "#60a5fa", decimals: 0, unit: "%" },
    { key: "air_velocity", label: "Air Velocity (m/s)", color: "#15803d", decimals: 1, unit: " m/s" },
    { key: "air_velocity_peak", label: "Peak Air Velocity (m/s)", color: "#072621", decimals: 1, unit: " m/s" },
    { key: "ozone", label: "Ozone (ppm)", color: "#22c55e", decimals: 3, unit: " ppm" },
    { key: "uv", label: "UV (mw/cm²)", color: "#f97316", decimals: 1, unit: " mW/cm²" },
    { key: "lum", label: "Luminosity (lx)", color: "#eab308", decimals: 0, unit: " lx" },
    { key: "baro", label: "Pressure (hPa)", color: "#be123c", decimals: 1, unit: " hPa" },
    { key: "pm1_0", label: "PM1.0 (µg/m³)", color: "#7c3aed", decimals: 1, unit: " µg/m³" },
    { key: "pm2_5", label: "PM2.5 (µg/m³)", color: "#e879f9", decimals: 1, unit: " µg/m³" },
    { key: "pm10", label: "PM10 (µg/m³)", color: "#f472b6", decimals: 1, unit: " µg/m³" },
    { key: "chamber_temp", label: "Chamber Temp (°C)", color: "#fb7185", decimals: 1, unit: "°C" },
];

// Lookup for easy access to metric info by key
export const METRIC_LOOKUP = Object.fromEntries(METRIC_OPTIONS.map(option => [option.key, option])) as Record<
    MetricKey,
    { key: MetricKey; label: string; color: string; decimals: number; unit: string }
>;

// Formats a metric value according to its defined decimals and unit, with optional truncation of decimal places
export const formatMetricValue = (metricKey: MetricKey, value: number | null, truncate: boolean = false) => {
    const metric = METRIC_LOOKUP[metricKey];
    return fmt(value, truncate ? 0 : metric.decimals, metric.unit);
};
