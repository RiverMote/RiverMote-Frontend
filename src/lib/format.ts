/* Time formatting helpers */

export function formatTime(epochSeconds: number): string {
    return new Date(epochSeconds * 1000).toLocaleString();
}

export function formatShortTime(epochSeconds: number): string {
    return new Date(epochSeconds * 1000).toLocaleTimeString();
}

export function formatDate(epochSeconds: number): string {
    return new Date(epochSeconds * 1000).toLocaleDateString();
}

export function formatRelative(epochSeconds: number): string {
    const diff = Date.now() / 1000 - epochSeconds;
    if (diff < 60) {
        return "just now";
    }
    if (diff < 3600) {
        return `${Math.floor(diff / 60)}m ago`;
    }
    if (diff < 86400) {
        return `${Math.floor(diff / 3600)}h ago`;
    }
    return `${Math.floor(diff / 86400)}d ago`;
}

// Format a numeric value with a fixed number of decimal places and a unit suffix
export function fmt(value: number | null, decimals = 1, unit = ""): string {
    if (value === null || value === undefined) {
        return "—";
    }
    return `${value.toFixed(decimals)}${unit}`;
}
