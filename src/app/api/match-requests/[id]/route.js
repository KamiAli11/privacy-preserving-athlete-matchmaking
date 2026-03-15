import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {jwtVerify} from "jose"; //

export async function PATCH(
    request,
    { params }
) {

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
        await jwtVerify(token, secret);
    } catch (err) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    try {
        const { id } = params;
        const { status, reason } = await request.json();

        const currentRequest = await prisma.matchRequest.findUnique({
            where: { id },
            include: {
                athletes: {
                    include: { athlete: true }
                }
            }
        });

        if (!currentRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        const updatedRequest = await prisma.matchRequest.update({
            where: { id: id },
            data: {
                status: status.toLowerCase(),
                reason: reason || null,
            },
        });

        await prisma.activityLog.create({
            data: {
                action: "MATCH_STATUS_UPDATED",
                userId: updatedRequest.requestedById,
                metadata: JSON.stringify({
                    matchRequestId: id,
                    status: status,
                    reason: reason || "N/A",
                    athletes: currentRequest.athletes.map(a => ({
                        athleteId: a?.licenseId,
                        name: `${a.athlete.firstName} ${a.athlete.lastName}`,
                        weightClass: a.athlete.weightClass,
                    })),
                    updatedAt: new Date().toISOString()
                })
            }
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}