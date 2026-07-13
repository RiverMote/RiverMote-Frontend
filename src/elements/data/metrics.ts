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
    | "baro"
    | "alt"
    | "aqi"
    | "voc"
    | "co2"
    | "uv"
    | "air_velocity"
    | "air_velocity_peak"
    | "ozone"
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
    decimalsImperial?: number;
    unitImperial?: string;
}> = [
    { key: "battery_v", label: "Battery Voltage", color: "#0f766e", decimals: 2, unit: " V" },
    { key: "battery_pct", label: "Battery Level", color: "#2563eb", decimals: 0, unit: "%" },
    { key: "water_temp", label: "Water Temp", color: "#0ea5e9", decimals: 1, unit: "°C", unitImperial: "°F" },
    { key: "turbidity", label: "Turbidity", color: "#f59e0b", decimals: 2, unit: " NTU" },
    { key: "tds", label: "TDS", color: "#34d399", decimals: 0, unit: " ppm" },
    { key: "air_temp", label: "Air Temp", color: "#f87171", decimals: 1, unit: "°C", unitImperial: "°F" },
    { key: "humidity", label: "Humidity", color: "#60a5fa", decimals: 0, unit: "%" },
    {
        key: "baro",
        label: "Pressure",
        color: "#be123c",
        decimals: 1,
        unit: " hPa",
        decimalsImperial: 2,
        unitImperial: " inHg",
    },
    { key: "alt", label: "Altitude", color: "#6d28d9", decimals: 1, unit: " m", unitImperial: " ft" },
    { key: "aqi", label: "AQI", color: "#eab308", decimals: 0, unit: " UBA AQI" },
    { key: "voc", label: "VOCs", color: "#7c2d12", decimals: 3, unit: " ppm" },
    { key: "co2", label: "CO₂", color: "#576882", decimals: 1, unit: " ppm" },
    { key: "uv", label: "UV", color: "#f97316", decimals: 1, unit: " UVI" },
    {
        key: "air_velocity",
        label: "Air Velocity",
        color: "#15803d",
        decimals: 1,
        unit: " m/s",
        unitImperial: " mph",
    },
    {
        key: "air_velocity_peak",
        label: "Peak Air Velocity",
        color: "#072621",
        decimals: 1,
        unit: " m/s",
        unitImperial: " mph",
    },
    { key: "ozone", label: "Ozone", color: "#1aa14b", decimals: 3, unit: " ppm" },
    { key: "pm1_0", label: "PM1.0", color: "#7c3aed", decimals: 1, unit: " µg/m³" },
    { key: "pm2_5", label: "PM2.5", color: "#e879f9", decimals: 1, unit: " µg/m³" },
    { key: "pm10", label: "PM10", color: "#f472b6", decimals: 1, unit: " µg/m³" },
    { key: "chamber_temp", label: "Chamber Temp", color: "#7178fb", decimals: 1, unit: "°C", unitImperial: "°F" },
];
// Cache for metric lookups by units to avoid recomputing on every render
const METRIC_CACHE: Partial<
    Record<string, Record<MetricKey, { key: MetricKey; label: string; color: string; decimals: number; unit: string }>>
> = {};

// Lookup for easy access to metric info by key
export const metricLookup = (units: "metric" | "imperial", addUnitToLabel = true) => {
    const key = `${units}-${addUnitToLabel}`;
    if (METRIC_CACHE[key]) {
        return METRIC_CACHE[key];
    }

    const lookup = Object.fromEntries(
        METRIC_OPTIONS.map(option => {
            const useImperial = units === "imperial";
            const unit = useImperial ? (option.unitImperial ?? option.unit) : option.unit;
            const decimals = useImperial ? (option.decimalsImperial ?? option.decimals) : option.decimals;
            return [
                option.key,
                {
                    ...option,
                    unit,
                    decimals,
                    label: addUnitToLabel ? `${option.label} (${unit.trim()})` : option.label,
                },
            ];
        }),
    ) as Record<MetricKey, { key: MetricKey; label: string; color: string; decimals: number; unit: string }>;

    METRIC_CACHE[key] = lookup;
    return lookup;
};

// Formats a metric value according to its defined decimals and unit, with optional truncation of decimal places
export const formatMetricValue = (
    metricKey: MetricKey,
    units: "metric" | "imperial" = "metric",
    value: number | null,
    truncate: boolean = false,
) => {
    const metric = metricLookup(units)[metricKey];
    return fmt(value, truncate ? 0 : metric.decimals, metric.unit);
};
