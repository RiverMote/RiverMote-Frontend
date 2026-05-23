import { Outlet, NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Home" },
    { to: "/data", label: "Data" },
    { to: "/about", label: "About" },
    { to: "/sponsors", label: "Sponsors" },
];

export default function Nav() {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-2000 bg-sky-200/20 backdrop-blur-md border-b border-sky-200/40">
                <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
                    <NavLink to="/" className="flex items-center gap-1">
                        <img className="w-8 pr-1" src="/RM_logo.png" />
                        <span className="hidden md:block text-xl font-semibold text-forest-400 tracking-tight">
                            River <span className="text-water-500">Mote</span>
                        </span>
                    </NavLink>

                    <nav className="flex items-center gap-1">
                        {links.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === "/"}
                                className={({ isActive }) =>
                                    `px-2 md:px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                                        isActive
                                            ? "bg-forest-600/10 text-forest-500"
                                            : "text-slate-600 hover:text-slate-400"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Page content */}
            <main className="pt-14">
                <Outlet />
            </main>
        </>
    );
}
