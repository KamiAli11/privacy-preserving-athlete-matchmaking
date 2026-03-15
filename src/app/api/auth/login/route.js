export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import {logAction} from "@/lib/logger";

export async function POST(req) {

    const body = await req.json();

    const user = await prisma.user.findUnique({
        where: { email: body.email }
    });

    if (!user) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    }

    const valid = await bcrypt.compare(
        body.password,
        user.password
    );

    if (!valid) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    }

    const token = signToken({
        userId: user.id,
    });

    await logAction(
        "COACH_LOGIN",
        user.id,
        JSON.stringify({
            name: user?.firstName + " " + user?.lastName,
            email: user.email,
            timestamp: new Date().toISOString()
        })
    );

    return NextResponse.json({
        token,
        user
    });
}
