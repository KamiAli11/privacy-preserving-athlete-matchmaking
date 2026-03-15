/*
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/!* Optional: Dashboard sidebar/header *!/}
                <header className="bg-white shadow p-4">
                    <h1 className="text-xl font-bold">Dashboard Header</h1>
                </header>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </ProtectedRoute>
    );
}*/


"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                            System Overview
                        </h2>
                    </header>

                    {/* Page Content */}
                    <main className="p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
