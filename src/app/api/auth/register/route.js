export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma';


export async function POST(req) {

    const body = await req.json();

    const existing = await prisma.user.findUnique({
        where: { email: body.email }
    });

    if (existing) {
        return NextResponse.json(
            { message: "Account already exists" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(
        body.password,
        10
    );

    const user = await prisma.user.create({
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
        }
    });

    return NextResponse.json(user);
}
