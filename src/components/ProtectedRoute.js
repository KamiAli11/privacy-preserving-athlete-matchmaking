"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({ children }) {
    const { token, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !token) {
            router.push("/");
        }
    }, [token, loading]);

    if (loading) return null; // wait for auth check

    if (!token) return null;

    return <>{children}</>;
}