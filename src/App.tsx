import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "@/lib/api";
import Nav from "@/elements/ui/Nav";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Data from "@/pages/Data";
import ConsoleLogin from "@/pages/ConsoleLogin";
import Console from "@/pages/Console";

// Guard that redirects unauthenticated users to the console login page
function RequireAuth({ children }: { children: React.ReactNode }) {
    if (!auth.isValid()) {
        return <Navigate to="/console/login" replace />;
    }
    return <>{children}</>;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public pages all share the top nav */}
                <Route element={<Nav />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/data" element={<Data />} />
                </Route>

                {/* Console has a separate nav-less layout */}
                <Route path="/console/login" element={<ConsoleLogin />} />
                <Route
                    path="/console"
                    element={
                        <RequireAuth>
                            <Console />
                        </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
