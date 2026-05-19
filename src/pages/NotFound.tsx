import { NavLink } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen px-6 py-10 flex items-center justify-center">
            <div className="panel p-8 max-w-md text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">404</p>
                <h1 className="text-2xl text-slate-600 font-semibold mt-2">Page not found</h1>
                <p className="text-sm text-slate-500 mt-3">
                    The page you are looking for does not exist or may have been moved.
                </p>
                <NavLink
                    to="/"
                    className="inline-flex mt-6 px-4 py-2 rounded-lg bg-forest-600 hover:bg-forest-500 text-white text-sm transition-colors"
                >
                    Back to home
                </NavLink>
            </div>
        </div>
    );
}
