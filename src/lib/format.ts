/* Time formatting helpers */

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
});

const shortTimeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat();

export function formatTime(epochSeconds: number): string {
    return timeFormatter.format(epochSeconds * 1000);
}

export function formatShortTime(epochSeconds: number): string {
    return shortTimeFormatter.format(epochSeconds * 1000);
}

export function formatDate(epochSeconds: number): string {
    return dateFormatter.format(epochSeconds * 1000);
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
