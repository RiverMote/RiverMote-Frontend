import { Link } from "react-router-dom";

// Placeholder stat cards shown on the landing page hero section
const heroStats = [
    { value: "24/7", label: "Live monitoring" },
    { value: "15min", label: "Data interval" },
    { value: "10+", label: "Sensors per node" },
];

// Feature highlight cards
const features = [
    {
        icon: "💧",
        title: "Water Quality",
        body: "Continuous turbidity, TDS, and temperature measurement at the waterline.",
    },
    {
        icon: "🌬",
        title: "Atmosphere",
        body: "Co-located air quality sensors capture particulate matter, ozone, humidity, barometric pressure, and ultraviolet levels.",
    },
    {
        icon: "📡",
        title: "Low-Power IoT",
        body: "Solar-powered nodes transmit to the cloud, reporting from remote riverbanks with only a cellular connection.",
    },
    {
        icon: "🗺",
        title: "Open Data",
        body: "All sensor readings are publicly accessible. Browse the live map, query historical ranges, and chart trends directly in your browser!",
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
                {/* Radial green glow behind the headline */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(52,133,54,0.18) 0%, transparent 70%)",
                    }}
                />

                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight max-w-3xl">
                    Understanding our{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-forest-400 to-water-400 animate-gradient-flow">
                        rivers
                    </span>
                    , in real time.
                </h1>

                <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
                    River Mote deploys open-hardware sensor nodes along waterways to collect continuous, high-frequency
                    environmental data, and makes it available to everyone.
                </p>

                <div className="mt-10 flex items-center gap-4">
                    <Link
                        to="/data"
                        className="px-6 py-3 rounded-full bg-forest-600 hover:bg-forest-500 text-white font-medium transition-colors duration-150 text-sm"
                    >
                        View live data →
                    </Link>
                    <Link
                        to="/about"
                        className="px-6 py-3 rounded-full border border-slate-300 hover:border-slate-900 text-slate-500 hover:text-slate-700 font-medium transition-colors duration-150 text-sm"
                    >
                        Learn more
                    </Link>
                </div>

                {/* Quick stats row */}
                <div className="mt-16 flex items-center gap-8 md:gap-16">
                    {heroStats.map(s => (
                        <div key={s.label} className="flex flex-col items-center gap-1">
                            <span className="data-value-lg text-forest-300 font-stretch-150%">{s.value}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature grid */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <h2 className="font-medium text-3xl text-slate-500 text-center mb-12">What we measure</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map(f => (
                        <div key={f.title} className="panel p-6 flex flex-col gap-3">
                            <span className="text-2xl">{f.icon}</span>
                            <h3 className="text-lg text-slate-500 font-semibold">{f.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
