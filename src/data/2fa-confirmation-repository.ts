import { db } from "@/lib/db";

export async function get2FAConfirmationByUserId(userId: string) {
    return await db.twoFactorConfirmation.findUnique({
        where: {
            userId
        }
    })
}

export async function delete2FAConfirmationById(id: string) {
    return await db.twoFactorConfirmation.delete({
        where: {
            id
        }
    })
}

export async function create2FAConfirmation(userId: string) {
    return await db.twoFactorConfirmation.create({
        data: {
            userId
        }
    })
}