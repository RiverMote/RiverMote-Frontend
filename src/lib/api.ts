import type { Device, Sample, Command, SensorHealth } from "@/types";

const TOKEN_KEY = "rivermoteToken";

/* Auth token helpers */

export const auth = {
    store: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
    token: () => localStorage.getItem(TOKEN_KEY),

    // Decode the JWT payload segment and check the expiry claim client-side
    isValid: (): boolean => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return false;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1])) as { exp: number };
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
};

// Fetch wrapper that attaches the auth token (this is used for endpoints that require auth, while public endpoints can use fetch directly)
async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = auth.token();
    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    // Redirect to login on 401 so any page handles auth expiry automatically
    if (res.status === 401) {
        auth.clear();
        window.location.href = "/console/login";
    }
    return res;
}

/* Public endpoints */

export async function fetchDevices(): Promise<Device[]> {
    const res = await fetch("/api/devices");
    if (!res.ok) {
        throw new Error("Failed to fetch devices");
    }
    return res.json() as Promise<Device[]>;
}

export async function fetchSamples(endpoint: string, limit: number | "all" = 100): Promise<Sample[]> {
    const res = await fetch(`/api/samples?endpoint=${encodeURIComponent(endpoint)}&limit=${limit}`);
    if (!res.ok) {
        throw new Error("Failed to fetch samples");
    }
    return res.json() as Promise<Sample[]>;
}

/* Auth-required endpoints */

export async function fetchCommands(endpoint: string, status?: string, limit: number | "all" = 50): Promise<Command[]> {
    const params = new URLSearchParams({ endpoint, limit: String(limit) });
    if (status) {
        params.set("status", status);
    }
    const res = await apiFetch(`/api/commands?${params}`);
    if (!res.ok) {
        throw new Error("Failed to fetch commands");
    }
    return res.json() as Promise<Command[]>;
}

export async function postCommand(
    endpoint: string,
    cmd: string,
    payload?: string,
): Promise<{ ok: boolean; sent: boolean }> {
    const res = await apiFetch("/api/commands", {
        method: "POST",
        body: JSON.stringify({ endpoint, cmd, payload }),
    });
    if (!res.ok) {
        throw new Error("Failed to send command");
    }
    return res.json() as Promise<{ ok: boolean; sent: boolean }>;
}

export async function fetchHealth(endpoint?: string): Promise<SensorHealth | SensorHealth[]> {
    const url = endpoint ? `/api/health?endpoint=${encodeURIComponent(endpoint)}` : "/api/health";
    const res = await apiFetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch health");
    }
    return res.json() as Promise<SensorHealth | SensorHealth[]>;
}

export async function login(password: string): Promise<string> {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });
    if (!res.ok) {
        throw new Error("Invalid password");
    }
    const data = (await res.json()) as { token: string };
    return data.token;
}
