"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const Sidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", },
        { name: "Athletes", href: "/dashboard/athletes", },
        { name: "Eligibility", href: "/dashboard/eligibility" },
        { name: "Matchmaking", href: "/dashboard/matchmaking" },
        { name: "Matchmaking Requests", href: "/dashboard/match-requests" },
        { name: "Audit Logs", href: "/dashboard/audit-logs" },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-xl font-bold tracking-tight text-gray-900">SecureMatch</span>
                </div>
            </div>

            {/* Navigation Menus */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={logout}
                    className=" cursor-pointer flex items-center gap-3 w-full px-4 py-3 text-red-500 border border-red-400  rounded-xl transition-colors font-medium"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;