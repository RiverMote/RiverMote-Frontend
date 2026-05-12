import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login, auth } from "@/lib/api";

export default function ConsoleLogin() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    if (auth.isValid()) {
        return <Navigate to="/console" replace />;
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const token = await login(password);
            auth.store(token);
            void navigate("/console", { replace: true });
        } catch {
            setError("Authentication failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-3xl font-semibold text-forest-400">
                        River <span className="text-water-400">Mote</span>
                    </span>
                </div>

                <form
                    onSubmit={e => {
                        void handleSubmit(e);
                    }}
                    className="panel p-8 flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-xs text-slate-400 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                            className="bg-slate-300/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-forest-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-sm font-bold text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="mt-2 py-2.5 rounded-lg bg-forest-600 hover:bg-forest-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors duration-150"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
