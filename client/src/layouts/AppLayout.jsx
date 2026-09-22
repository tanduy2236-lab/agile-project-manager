import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import {
    BarChart3,
    Bell,
    FileText,
    FolderKanban,
    KanbanSquare,
    LayoutGrid,
    LogOut,
    Settings,
    User,
    Users,
    ClipboardList,
} from "lucide-react";
import { logout } from "../api/auth.api";
import { clearAuth } from "../utils/auth";

const AppLayout = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const projectNavItems = id
        ? [
              { label: "Overview", to: `/projects/${id}`, end: true, icon: FolderKanban },
              { label: "Board", to: `/projects/${id}/board`, icon: KanbanSquare },
              { label: "Backlog", to: `/projects/${id}/backlog`, icon: ClipboardList },
              { label: "Sprints", to: `/projects/${id}/sprints`, icon: BarChart3 },
              { label: "Members", to: `/projects/${id}/members`, icon: Users },
              { label: "Documents", to: `/projects/${id}/documents`, icon: FileText },
          ]
        : [];

    const navItems = [
        { label: "Dashboard", to: "/dashboard", icon: BarChart3 },
        { label: "Projects", to: "/projects", icon: FolderKanban },
        ...projectNavItems,
        { label: "Notifications", to: "/notifications", icon: Bell },
        { label: "Profile", to: "/profile", icon: User },
        { label: "Settings", to: "/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }

        clearAuth();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto flex max-w-[1800px]">
                <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-900 p-5 text-slate-100 shadow-xl lg:flex">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <LayoutGrid className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                                Agile
                            </p>
                            <h1 className="text-lg font-bold text-white">Task Manager</h1>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map(({ label, to, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </aside>

                <div className="flex-1">
                    <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 lg:hidden">
                        <div className="flex items-center justify-between gap-3 overflow-x-auto">
                            {navItems.map(({ label, to, icon: Icon, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                        }`
                                    }
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </header>

                    <main className="min-h-screen">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
