export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const { payload } = await jwtVerify(token, secret);

        const userId = payload.userId;

        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
        });

        // Map logs to a clean format for frontend
        const formattedLogs = logs.map((log) => ({
            id: log.id,
            action: log.action,
            metadata: log.metadata,
            userId: log.user ? `${log.user.firstName || ""} ${log.user.lastName || ""}`.trim() || log.user.email : null,
            createdAt: log.createdAt,
        }));

        return NextResponse.json({ logs: formattedLogs });
    } catch (error) {
        console.error("Fetch logs error:", error);
        return NextResponse.json(
            { error: "Failed to fetch logs" },
            { status: 500 }
        );
    }
}
