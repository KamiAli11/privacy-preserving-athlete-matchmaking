export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {jwtVerify} from "jose";
import { publicKey, privateKey } from "@/lib/paillierEncryption";
import {logAction} from "@/lib/logger";


function extractWeight(weightClass) {
    if (!weightClass) return 0;

    const num = parseInt(weightClass.replace(/\D/g, ""));
    return num || 0;
}

export async function GET(req) {

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Token verify kora (Secret key ti .env file e thaka uchit)
    // Note: jose use korle secret key ta TextEncoder diye encode korte hoy
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
        await jwtVerify(token, secret);
    } catch (err) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    try {
        const requests = await prisma.matchRequest.findMany({
            include: {
                athletes: { include: { athlete: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req) {

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Unauthorized: No token provided" },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    let user;

    try {
        const { payload } = await jwtVerify(token, secret);
        user = payload;
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
        );
    }

    const body = await req.json();
    const { athleteIds } = body;

    if (!athleteIds || athleteIds.length !== 2) {
        return NextResponse.json(
            { error: "Exactly two athlete IDs required" },
            { status: 400 }
        );
    }

    try {

        const athletes = await prisma.athlete.findMany({
            where: {
                id: { in: athleteIds }
            }
        });

        if (athletes.length !== 2) {
            return NextResponse.json(
                { error: "Athletes not found" },
                { status: 404 }
            );
        }

        const [a, b] = athletes;

        if (a.gender !== b.gender) {
            return NextResponse.json(
                {
                    matchAllowed: false,
                    reason: "Male vs Female match not allowed"
                },
                { status: 400 }
            );
        }

        const weightA = extractWeight(a.weightClass);
        const weightB = extractWeight(b.weightClass);

        const cipherA = publicKey.encrypt(BigInt(weightA));
        const cipherB = publicKey.encrypt(BigInt(weightB));

        const cipherSum = publicKey.addition(cipherA, cipherB);
        const decryptedSum = privateKey.decrypt(cipherSum);

        const weightDiff = Math.abs(weightA - weightB);

        if (weightDiff > 8) {
            return NextResponse.json({
                matchAllowed: false,
                reason: "Not Recommended – weight difference exceeds allowed range",
                weightDifference: weightDiff,
                encryptedSum: cipherSum.toString()
            }, { status: 400 });
        }

        const matchRequest = await prisma.matchRequest.create({
            data: {
                requestedById: user?.userId,
                athletes: {
                    create: athleteIds.map((id) => ({
                        athleteId: id
                    }))
                }
            },
            include: {
                athletes: {
                    include: { athlete: true }
                }
            }
        });

        await logAction(
            "MATCH_REQUEST_CREATED",
            user.userId,
            JSON.stringify({
                matchRequestId: matchRequest.id,
                athletes: matchRequest.athletes.map((a) => ({
                    athleteId: a.licenseId,
                    name: `${a.athlete.firstName} ${a.athlete.lastName}`,
                    weightClass: a.athlete.weightClass,
                })),
                status: matchRequest.status,
                timestamp: matchRequest.createdAt.toISOString(),
            }))

        return NextResponse.json({
            matchAllowed: true,
            matchRequest,
            encryption: {
                encryptedSum: cipherSum.toString(),
                decryptedSum: decryptedSum.toString()
            },
            weightDifference: weightDiff
        });

    } catch (error) {
        console.error("Match Request Error:", error);

        return NextResponse.json(
            { error: "Could not create match request" },
            { status: 500 }
        );
    }
}
