"use client";

import { useState, useEffect } from "react";
import {
    Swords,
    Plus,
    ShieldCheck,
    Cpu,
    Loader2,
    ArrowRightLeft,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";

export default function MatchmakingPage() {
    const [athletes, setAthletes] = useState([]);
    const [selectedA, setSelectedA] = useState("");
    const [selectedB, setSelectedB] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();

    usePageTitle("Matchmaking Portal");


    useEffect(() => {
        if (!token) return;

        fetch("/api/athletes", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setAthletes(Array.isArray(data) ? data : []))
            .catch(() => setAthletes([]));
    }, [token]);

    const createMatchRequest = async () => {
        if (!selectedA || !selectedB) return;

        if (selectedA === selectedB) {
            setStatus({
                type: "error",
                message: "You cannot match an athlete with themselves!",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/match-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ athleteIds: [selectedA, selectedB] }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({
                    type: "error",
                    message: data.error || data.reason || "Match validation failed",
                });
                return;
            }

            setStatus({
                type: "success",
                message: "Match request created successfully!",
            });

            setSelectedA("");
            setSelectedB("");
        } catch (error) {
            setStatus({
                type: "error",
                message: "Server error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Swords size={28} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Matchmaking Portal
                    </h1>
                    <p className="text-sm text-gray-500">
                        Pair two athletes for a match request and verify eligibility.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-8">

                    <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">

                        <div className="md:col-span-5 space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">
                                Athlete 1
                            </label>

                            <select
                                value={selectedA}
                                onChange={(e) => setSelectedA(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select First Athlete</option>

                                {athletes.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.firstName} {a.lastName} — {a.weightClass} ({a.gender})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1 flex justify-center pt-6">
                            <div className="bg-gray-100 p-2 rounded-full text-gray-400">
                                <ArrowRightLeft size={20} />
                            </div>
                        </div>


                        <div className="md:col-span-5 space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">
                                Athlete 2
                            </label>

                            <select
                                value={selectedB}
                                onChange={(e) => setSelectedB(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select Second Athlete</option>

                                {athletes.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.firstName} {a.lastName} — {a.weightClass} ({a.gender})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                        <button
                            onClick={createMatchRequest}
                            disabled={loading || !selectedA || !selectedB}
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Plus size={20} />
                            )}

                            Create Official Match Request
                        </button>

                        {status.message && (
                            <div
                                className={`mt-4 flex items-center gap-2 text-sm font-medium ${
                                    status.type === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {status.type === "success" ? (
                                    <CheckCircle2 size={16} />
                                ) : (
                                    <AlertCircle size={16} />
                                )}

                                {status.message}
                            </div>
                        )}
                    </div>

                </div>
            </div>


            <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">

                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Cpu size={120} />
                </div>

                <div className="relative z-10">

                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <ShieldCheck size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">
              Privacy Lab
            </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2">
                        Encrypted Compatibility Check
                    </h2>

                    <p className="text-gray-400 text-sm mb-8 max-w-lg">
                        Securely compare profiles using encrypted data without revealing any private information.
                    </p>

                    <CompatibilityCheck
                        athletes={athletes}
                        selectedA={selectedA}
                        selectedB={selectedB}
                    />

                </div>
            </div>

        </div>
    );
}

function CompatibilityCheck({ athletes, selectedA, selectedB }) {

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const compute = async () => {

        if (!selectedA || !selectedB) return;

        const athleteA = athletes.find(a => a.id === selectedA);
        const athleteB = athletes.find(a => a.id === selectedB);

        if (!athleteA || !athleteB) return;

        setLoading(true);

        try {

            const res = await fetch("/api/compatibility-check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    a: athleteA.weightClass,
                    b: athleteB.weightClass
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({
                    matchAllowed: false,
                    reason: data.error || data.reason || "Compatibility check failed"
                });
            } else {
                setResult(data);
            }

        } catch (err) {

            setResult({
                matchAllowed: false,
                reason: "Server error during compatibility check"
            });

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="space-y-6">

            <button
                onClick={compute}
                disabled={!selectedA || !selectedB}
                className="cursor-pointer bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-black px-10 py-3 rounded-xl font-bold shadow-lg"
            >
                {loading ? "Checking..." : "Run Compatibility Check"}
            </button>

            {result && (

                <div className="space-y-4">

                    <div className={`p-4 rounded-xl flex items-center gap-2 font-semibold ${
                        result.matchAllowed
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                    }`}>

                        {result.matchAllowed ? (
                            <>
                                <CheckCircle2 size={18} />
                                Safe Match
                            </>
                        ) : (
                            <>
                                <AlertCircle size={18} />
                                Not Recommended
                            </>
                        )}

                    </div>

                    {!result.matchAllowed && (
                        <div className="text-sm text-red-400">
                            {result.reason}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="bg-gray-800 p-4 rounded-xl">
                            <p className="text-xs text-gray-400 mb-1">
                                Encrypted Ciphertext
                            </p>

                            <p className="font-mono text-blue-400 break-all text-sm">
                                {result.encryptedSum}
                            </p>
                        </div>

                        <div className="bg-blue-900/20 p-4 rounded-xl">
                            <p className="text-xs text-blue-400 mb-1">
                                Weight Class Difference
                            </p>

                            <p className="text-3xl font-bold">
                                {result.weightDifference ?? "-"}
                            </p>
                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}