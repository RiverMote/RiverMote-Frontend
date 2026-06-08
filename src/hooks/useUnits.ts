import { useState, useEffect } from "react";

const STORAGE_UNITS_KEY = "rivermote:units";

export function useUnits() {
    const [units, setUnits] = useState<"metric" | "imperial">(() => {
        const stored = localStorage.getItem(STORAGE_UNITS_KEY);
        return stored === "metric" || stored === "imperial" ? stored : "imperial"; // Default to imperial
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_UNITS_KEY, units);
    }, [units]);

    return { units, setUnits };
}
