"use client";

import { useEffect, useState } from "react";
import { User, Activity, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";

export default function DashboardPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalAthletes: 0,
        eligibleAthletes: 0,
        pendingMatches: 0,
        rejectedMatches: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch("/api/dashboard-stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [token]);

    usePageTitle("Dashboard");

    return (
        <div className="max-w-8xl mx-auto p-6 space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Quick summary of athletes and match requests</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-500" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <Card title="Total Athletes" value={stats.totalAthletes} icon={<User size={28} className="text-blue-600" />} />
                    <Card title="Eligible Athletes" value={stats.eligibleAthletes} icon={<CheckCircle size={28} className="text-green-600" />} />
                    <Card title="Pending Matches" value={stats.pendingMatches} icon={<Clock size={28} className="text-amber-600" />} />
                    <Card title="Approved Matches" value={stats.approvedMatches} icon={<Clock size={28} className="text-green-600" />} />
                    <Card title="Rejected Matches" value={stats.rejectedMatches} icon={<XCircle size={28} className="text-red-600" />} />
                </div>
            )}
        </div>
    );
}

function Card({ title, value, icon }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-gray-100">
            <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-semibold">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}