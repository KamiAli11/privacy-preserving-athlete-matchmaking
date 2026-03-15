"use client";

import React, { useEffect, useState } from "react";
import {
    Clock, User, Activity, ChevronDown, ChevronUp,
    Database, Shield, Search, Filter, ClipboardList
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";

const MetadataRenderer = ({ metadataString }) => {
    if (!metadataString) return <p className="text-gray-400 italic text-sm">No additional data.</p>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    try {
        const data = JSON.parse(metadataString);

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data).map(([key, value]) => {
                        if (key === "athletes") return null;

                        const isDate = key.toLowerCase().includes('timestamp') ||
                            key.toLowerCase().includes('at') ||
                            (typeof value === 'string' && value.includes('T') && value.endsWith('Z'));

                        return (
                            <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-sm font-medium text-gray-700 break-all">
                                    {isDate ? formatDate(value) : (typeof value === 'object' ? JSON.stringify(value) : String(value))}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {data.athletes && Array.isArray(data.athletes) && (
                    <div className="mt-4">
                        <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-2 px-1">Affected Athletes</h4>
                        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Weight Class</th>
                                    <th className="px-4 py-2 text-right font-semibold text-gray-600">ID</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {data.athletes.map((athlete, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-4 py-2 font-medium text-blue-700">{athlete.name}</td>
                                        <td className="px-4 py-2 text-gray-600">{athlete.weightClass}</td>
                                        <td className="px-4 py-2 text-right text-gray-400 font-mono text-[11px]">{athlete.athleteId}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (e) {
        return <pre className="text-xs bg-red-50 p-2 text-red-500 rounded">{metadataString}</pre>;
    }
};

export default function AuditLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLog, setExpandedLog] = useState(null);
    const { token } = useAuth();
    usePageTitle("Audit Logs");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/logs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setLogs(data.logs || []);
            } catch (err) {
                console.error("Failed to fetch logs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    const getStatusColor = (action) => {
        const colors = {
            MATCH_REQUEST_CREATED: "text-purple-700 bg-purple-50 border-purple-200",
            COACH_LOGIN: "text-blue-700 bg-blue-50 border-blue-200",
            ELIGIBILITY_CHECK: "text-emerald-700 bg-emerald-50 border-emerald-200",
            ENCRYPTED_COMPARISON: "text-orange-700 bg-orange-50 border-orange-200",
            default: "text-slate-600 bg-slate-50 border-slate-200"
        };
        return colors[action] || colors.default;
    };

    return (
        <div className="max-w-6xl mx-auto p-8 min-h-screen bg-[#F8FAFC]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Security Audit Logs
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        Real-time monitor for system actions and encrypted data access.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                    <Database size={16} className="text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">{logs.length} Events Logged</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium animate-pulse">Fetching encrypted records...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-32 text-center">
                        <ClipboardList className="mx-auto text-slate-200 mb-4" size={64} />
                        <p className="text-slate-400 text-lg font-medium">No activity found in the system.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Time & Date</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Event Action</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Authorized User</th>
                                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Details</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <React.Fragment key={log.id}>
                                    <tr
                                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                        className={`group cursor-pointer transition-all duration-200 ${expandedLog === log.id ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                        {new Date(log.createdAt).toLocaleDateString()}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(log.action)}`}>
                                                    {log.action.replace(/_/g, " ")}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-white border transition-colors">
                                                    <User size={12} className="text-slate-500" />
                                                </div>
                                                {log.userId ? log.userId.substring(0, 12) : "System Engine"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`inline-flex items-center justify-center p-1 rounded-full transition-colors ${expandedLog === log.id ? 'bg-blue-600 text-white' : 'text-slate-300 bg-transparent'}`}>
                                                {expandedLog === log.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Dropdown Panel */}
                                    {expandedLog === log.id && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-6 bg-slate-50/80 shadow-inner">
                                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                                                        <Activity size={16} className="text-blue-500" />
                                                        <h3 className="font-bold text-sm">Action Metadata</h3>
                                                    </div>
                                                    <MetadataRenderer metadataString={log.metadata} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="mt-6 text-center text-slate-400 text-xs font-medium">
                🔒 All actions are cryptographically signed and immutable.
            </p>
        </div>
    );
}