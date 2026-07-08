// Human-readable interpretations of select metrics, with color coding for severity

export function turbidity(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val < 1) {
        return { text: "Clear", color: "text-green-400" };
    }
    if (val < 5) {
        return { text: "Slightly turbid", color: "text-yellow-400" };
    }
    if (val < 50) {
        return { text: "Turbid", color: "text-orange-400" };
    }
    return { text: "Very turbid", color: "text-red-400" };
}

export function tds(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val < 300) {
        return { text: "Excellent", color: "text-green-400" };
    }
    if (val < 600) {
        return { text: "Good", color: "text-yellow-400" };
    }
    if (val < 900) {
        return { text: "Fair", color: "text-orange-400" };
    }
    return { text: "Poor", color: "text-red-400" };
}

export function ozone(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 0.054) {
        return { text: "Good", color: "text-green-400" };
    }
    if (val <= 0.07) {
        return { text: "Moderate", color: "text-yellow-400" };
    }
    if (val <= 0.085) {
        return { text: "Unhealthy for sensitive groups", color: "text-orange-400" };
    }
    if (val <= 0.105) {
        return { text: "Unhealthy", color: "text-red-400" };
    }
    if (val <= 0.2) {
        return { text: "Very unhealthy", color: "text-purple-400" };
    }
    return { text: "Hazardous", color: "text-maroon-400" };
}

export function pm1_25(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 12) {
        return { text: "Good", color: "text-green-400" };
    }
    if (val <= 35.4) {
        return { text: "Moderate", color: "text-yellow-400" };
    }
    if (val <= 55.4) {
        return { text: "Unhealthy for sensitive groups", color: "text-orange-400" };
    }
    if (val <= 150.4) {
        return { text: "Unhealthy", color: "text-red-400" };
    }
    if (val <= 250.4) {
        return { text: "Very unhealthy", color: "text-purple-400" };
    }
    return { text: "Hazardous", color: "text-maroon-400" };
}

export function pm10(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 54) {
        return { text: "Good", color: "text-green-400" };
    }
    if (val <= 154) {
        return { text: "Moderate", color: "text-yellow-400" };
    }
    if (val <= 254) {
        return { text: "Unhealthy for sensitive groups", color: "text-orange-400" };
    }
    if (val <= 354) {
        return { text: "Unhealthy", color: "text-red-400" };
    }
    if (val <= 424) {
        return { text: "Very unhealthy", color: "text-purple-400" };
    }
    return { text: "Hazardous", color: "text-maroon-400" };
}

export function voc(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 0.3) {
        return { text: "Excellent", color: "text-green-400" };
    }
    if (val <= 0.5) {
        return { text: "Good", color: "text-yellow-400" };
    }
    if (val <= 1.0) {
        return { text: "Moderate", color: "text-orange-400" };
    }
    if (val <= 3.0) {
        return { text: "Poor", color: "text-red-400" };
    }
    return { text: "Very poor", color: "text-purple-400" };
}

export function co2(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    if (val <= 800) {
        return { text: "Excellent", color: "text-green-400" };
    }
    if (val <= 1000) {
        return { text: "Good", color: "text-yellow-400" };
    }
    if (val <= 1400) {
        return { text: "Moderate", color: "text-orange-400" };
    }
    if (val <= 2000) {
        return { text: "Poor", color: "text-red-400" };
    }
    return { text: "Very poor", color: "text-purple-400" };
}

export function aqi(val: number | null): { text: string; color: string } {
    if (val === null) {
        return { text: "", color: "" };
    }
    switch (Math.round(val)) {
        case 1:
            return { text: "Very good", color: "text-green-400" };
        case 2:
            return { text: "Good", color: "text-lime-400" };
        case 3:
            return { text: "Moderate", color: "text-yellow-400" };
        case 4:
            return { text: "Poor", color: "text-orange-400" };
        default:
            return { text: "Very poor", color: "text-red-400" };
    }
}
