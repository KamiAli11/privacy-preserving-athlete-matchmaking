"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { CheckCircle, XCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

export default function MatchRequestsPage() {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    usePageTitle("Match Requests");
    const fetchRequests = async () => {
        if (!token) return;
        try {
            const res = await fetch("/api/match-requests", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, [token]);

    const handleUpdateStatus = async (id, newStatus) => {
        let reason = "";
        if (newStatus === "REJECTED") {
            reason = prompt("Enter reason for rejection:");
            if (!reason) return; // Cancel if no reason provided
        }

        try {
            const res = await fetch(`/api/match-requests/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, reason })
            });

            if (res.ok) {
                // Refresh list
                fetchRequests();
            }
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toUpperCase()) {
            case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
            case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Match Requests</h1>
                <p className="text-slate-500">Review and manage athlete pairing requests.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Athletes</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reason/Notes</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Requested At</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                    {requests.map((r) => {
                        const a1 = r.athletes[0]?.athlete;
                        const a2 = r.athletes[1]?.athlete;

                        return (
                            <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-slate-800 text-sm">{a1?.firstName} {a1?.lastName}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">VS</span>
                                        <span className="font-semibold text-slate-800 text-sm">{a2?.firstName} {a2?.lastName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(r.status)}`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2 max-w-[200px]">
                                        <MessageSquare size={14} className="mt-1 text-slate-400 shrink-0" />
                                        <span className="text-sm text-slate-600 truncate">{r.reason || "No notes"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {r.status === "pending" && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(r.id, "APPROVED")}
                                                className="cursor-pointer p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors border border-transparent hover:border-green-200"
                                                title="Approve"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                                                className="cursor-pointer p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                title="Reject"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    )}
                                    {r.status !== "pending" && (
                                        <span className="text-xs text-slate-500 font-italic italic">Processed</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {requests.length === 0 && !loading && (
                    <div className="p-20 text-center text-slate-400">
                        No match requests found.
                    </div>
                )}
            </div>
        </div>
    );
}