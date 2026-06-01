export const AXIS_TICK = { fill: "#64748b", fontSize: 11 };
export const X_AXIS_PROPS = {
    dataKey: "unixTime",
    tick: AXIS_TICK,
    type: "number" as const,
    domain: ["dataMin", "dataMax"] as const,
    scale: "time" as const,
};

// Build a list of evenly spaced time ticks for all graph X axes
export const buildTimeTicks = (data: Array<{ unixTime: number }>, maxTicks = 6) => {
    if (data.length === 0) {
        return [] as number[];
    }

    const min = Math.min(...data.map(d => d.unixTime));
    const max = Math.max(...data.map(d => d.unixTime));
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return [] as number[];
    }

    if (min === max) {
        return [min];
    }

    const tickCount = Math.max(2, Math.min(maxTicks, data.length));
    const step = (max - min) / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => Math.round(min + step * i));
};
