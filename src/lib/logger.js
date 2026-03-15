import prisma from "./prisma";

export async function logAction(action, userId, metadata) {
    try {
        await prisma.activityLog.create({
            data: {
                action,
                userId,
                metadata,
            },
        });
    } catch (error) {
        console.error("Failed to log action:", error);
    }
}