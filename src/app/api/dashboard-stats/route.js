export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
        await jwtVerify(token, secret);

        const totalAthletes = await prisma.athlete.count();
        const eligibleAthletes = await prisma.athlete.count({ where: { medicalOk: true } });
        const pendingMatches = await prisma.matchRequest.count({ where: { status: "pending" } });
        const approvedMatches = await prisma.matchRequest.count({ where: { status: "approved" } });
        const rejectedMatches = await prisma.matchRequest.count({ where: { status: "rejected" } });

        return NextResponse.json({ totalAthletes, eligibleAthletes, pendingMatches, approvedMatches, rejectedMatches });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
