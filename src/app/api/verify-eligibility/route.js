export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import crypto from "crypto"
import {logAction} from "@/lib/logger";

function generateProof(athlete) {

    const condition = athlete.medicalOk

    const proof = crypto
        .createHash("sha256")
        .update(`${athlete.licenseId}-${condition}`)
        .digest("hex")

    return {
        eligible: condition,
        proof
    }
}

export async function POST(req) {

    try {

        const authHeader = req.headers.get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        const { payload } = await jwtVerify(token, secret)

        const userId = payload.userId

        const { licenseId } = await req.json()

        if (!licenseId) {
            return NextResponse.json(
                { error: "License ID is required" },
                { status: 400 }
            )
        }

        const athlete = await prisma.athlete.findUnique({
            where: { licenseId }
        })

        if (!athlete) {
            return NextResponse.json(
                { error: "Athlete not found" },
                { status: 404 }
            )
        }

        const result = generateProof(athlete)

        await logAction(
            "ELIGIBILITY_CHECK",
            userId,
            JSON.stringify({
                athleteId: athlete.id,
                licenseId: athlete.licenseId,
                athleteName: `${athlete.firstName} ${athlete.lastName}`,
                eligible: result.eligible,
                timestamp: new Date().toISOString()
            })
        );

        return NextResponse.json({
            licenseId: athlete.licenseId,
            athleteName: `${athlete.firstName} ${athlete.lastName}`,
            eligible: result.eligible,
            zkProof: result.proof,
            verifiedAt: new Date()
        })

    } catch (error) {

        console.error(error)

        return NextResponse.json(
            { error: "Verification failed" },
            { status: 500 }
        )
    }
}
