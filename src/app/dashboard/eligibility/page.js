"use client";

import { useState } from 'react';
import { Search, CheckCircle2, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from "@/lib/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";

export default function EligibilityPage() {
    const [athleteId, setAthleteId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    usePageTitle("Eligibility Verification");

    const checkEligibility = async () => {
        if (!athleteId) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/verify-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ licenseId: athleteId }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Verification failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" />
                    Eligibility Verification
                </h1>
                <p className="text-gray-500">Enter an Athlete's License ID to check their medical and competition status.</p>
            </div>

            {/* Search Box Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            placeholder="Enter Athlete ID (e.g. LIC-1234)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                            value={athleteId}
                            onChange={e => setAthleteId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkEligibility()}
                        />
                    </div>
                    <button
                        onClick={checkEligibility}
                        disabled={loading || !athleteId}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Now'}
                    </button>
                </div>
            </div>

            {/* Result Display */}
            {result && (
                <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border p-8 ${
                    result.eligible
                        ? 'bg-green-50 border-green-100'
                        : 'bg-red-50 border-red-100'
                }`}>
                    {result.error ? (
                        <div className="text-center py-4">
                            <p className="text-red-600 font-medium">No athlete found with this ID.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Icon */}
                            <div className={`p-4 rounded-full ${
                                result.eligible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                                {result.eligible
                                    ? <CheckCircle2 size={48} />
                                    : <XCircle size={48} />
                                }
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-900">{result.athleteName}</h2>
                                <p className="text-gray-500 mb-2">License ID: <span className="font-mono">{athleteId}</span></p>

                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                                        result.eligible
                                            ? 'bg-green-600 text-white'
                                            : 'bg-red-600 text-white'
                                    }`}>
                                        {result.eligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                    <span className="bg-white/50 border px-3 py-1 rounded-full text-sm text-gray-600">
                                        ZK Proof Verified
                                    </span>
                                </div>
                            </div>

                            {/* Timestamp */}
                            <div className="text-sm text-gray-400">
                                Checked on: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!result && !loading && (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400">Search results will appear here after verification.</p>
                </div>
            )}
        </div>
    );
}