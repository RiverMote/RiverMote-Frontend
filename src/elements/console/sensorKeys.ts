import type { SensorHealth } from "@/types";

export const SENSOR_KEYS: Array<{ key: keyof SensorHealth; label: string }> = [
    { key: "temperature", label: "Water Temp" },
    { key: "turbidity", label: "Turbidity" },
    { key: "tds", label: "TDS" },
    { key: "environmental", label: "Environment" },
    { key: "ozone", label: "Ozone" },
    { key: "air_velocity", label: "Air Velocity" },
    { key: "particulate_matter", label: "Particulates" },
    { key: "chamber_temp", label: "Chamber Temp" },
];
