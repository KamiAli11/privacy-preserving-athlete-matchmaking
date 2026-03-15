export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {jwtVerify} from "jose";

export async function GET(req) {

    const authHeader = req.headers.get("authorization");
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

    const { searchParams } = new URL(req.url);
    const weightClass = searchParams.get("weightClass");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const gender = searchParams.get("gender");



    const where = {};
    if (weightClass) {
        where.weightClass = {
            contains: weightClass,
            mode: "insensitive"
        };
    }
    if (gender) {
        where.gender = {
            equals: gender,
            mode: "insensitive",
        };
    }

    const now = new Date();

    if (minAge) {
        const minDate = new Date(now.getFullYear() - parseInt(minAge), now.getMonth(), now.getDate());
        where.dateOfBirth = { ...where.dateOfBirth, lte: minDate };
    }

    if (maxAge) {
        const maxDate = new Date(now.getFullYear() - parseInt(maxAge), now.getMonth(), now.getDate());
        where.dateOfBirth = { ...where.dateOfBirth, gte: maxDate };
    }

    try {
        const athletes = await prisma.athlete.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                dateOfBirth: true,
                weightClass: true,
                licenseId: true,
                medicalOk: true,
            },
        });

        return NextResponse.json(athletes);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
