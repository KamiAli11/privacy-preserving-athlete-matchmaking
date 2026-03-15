import { generateRandomKeys } from "paillier-bigint";
import { NextResponse } from "next/server";
import {logAction} from "@/lib/logger";
import {jwtVerify} from "jose";

let publicKey, privateKey;

async function initKeys() {
    if (!publicKey || !privateKey) {
        try {
            console.log("Generating Paillier keys (512 bits)...");

            // generateRandomKeys is async
            const { publicKey: pub, privateKey: priv } = await generateRandomKeys(512);

            publicKey = pub;
            privateKey = priv;

            if (typeof publicKey.encrypt !== "function") {
                throw new Error("Generated publicKey missing encrypt method");
            }

            if (typeof privateKey.decrypt !== "function") {
                throw new Error("Generated privateKey missing decrypt method");
            }

            console.log("Keys generated successfully");
        } catch (error) {
            console.error("Key generation failed:", error);
            throw new Error("Failed to initialize homomorphic encryption keys");
        }
    }
}

function calculateAge(dob) {
    return Math.floor((Date.now() - new Date(dob)) / 31557600000);
}

export async function POST(req) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId;

    try {
        await initKeys();

        const body = await req.json();
        const { a, b } = body;

        if (!a || !b) {
            return NextResponse.json({ error: "Two weight required" }, { status: 400 });
        }

        const weightA = parseInt(a.split("/")[1]);
        const weightB = parseInt(b.split("/")[1]);


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
            });
        }

        await logAction(
            "MATCH_ENCRYPTED_COMPARISON",
            userId,
            JSON.stringify({
                dobA: a,
                dobB: b,
                weightA,
                weightB,
                weightDiff,
                matchAllowed: true,
                timestamp: new Date().toISOString(),
            })
        );

        // Success Response
        return NextResponse.json({
            matchAllowed: true,
            encryptedSum: cipherSum.toString(),
            decryptedSum: decryptedSum.toString(),
            weightDifference: weightDiff,
            status: "Safe Match",
        });

    } catch (error) {
        console.error("HE Error:", error);
        return NextResponse.json(
            { error: "Encryption process failed: " + error.message },
            { status: 500 }
        );
    }
}