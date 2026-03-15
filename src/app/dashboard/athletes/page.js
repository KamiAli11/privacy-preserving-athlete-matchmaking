"use client";
import { useAuth } from "@/lib/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import usePageTitle from "@/hooks/usePageTitle";

function LicenseCell({ licenseId }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(licenseId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // hide after 1.5 seconds
    };

    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <span className="font-mono text-sm text-gray-500">{licenseId}</span>
            <button
                onClick={handleCopy}
                className="text-blue-500 hover:text-blue-700 text-xs px-1 py-0.5 border border-blue-200 rounded transition-colors cursor-pointer"
                title="Copy License ID"
            >
                {copied ? (
                    <span className="text-green-600 text-xs font-semibold">Copied!</span>
                ): 'Copy'}
            </button>

        </div>
    );
}

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [athletes, setAthletes] = useState([])
    const [filters, setFilters] = useState({ gender: '', weightClass: '', minAge: '', maxAge: '' })
    usePageTitle("Athletes");

    useEffect(() => {
        if (user && token) {
            const params = new URLSearchParams(filters).toString()
            fetch(`/api/athletes?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => res.json())
                .then(setAthletes)
        }
    }, [user, filters])

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Athletes</h1>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Search Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <select
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={filters.gender}
                                onChange={e => setFilters({ ...filters, gender: e.target.value })}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Weight Class</label>
                            <input
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. 75kg"
                                value={filters.weightClass}
                                onChange={e => setFilters({ ...filters, weightClass: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Min Age</label>
                            <input
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                type="number"
                                placeholder="18"
                                value={filters.minAge}
                                onChange={e => setFilters({ ...filters, minAge: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Max Age</label>
                            <input
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                type="number"
                                placeholder="35"
                                value={filters.maxAge}
                                onChange={e => setFilters({ ...filters, maxAge: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Athletes Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Full Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Gender</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Age</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Weight Class</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">License ID</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {athletes.length > 0 ? (
                                athletes.map(a => (
                                    <tr key={a.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {a.firstName} {a.lastName}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {a?.gender}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date().getFullYear() - new Date(a.dateOfBirth).getFullYear()} years
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                                                      {a.weightClass ? a.weightClass : 'N/A'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <LicenseCell licenseId={a.licenseId} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No athletes found matching the filters.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

}