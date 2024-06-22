import { db } from "@/lib/db";

export async function getPasswordResetTokenByToken(token: string) {
    return await db.passwordResetToken.findUnique({
        where: {
            token
        }
    })
}

export async function getPasswordResetTokenByEmail(email: string) {
    return await db.passwordResetToken.findFirst({
        where: {
            email
        }
    })
}

export async function createPasswordResetToken(email: string, token: string, expireAt: Date) {
    return await db.passwordResetToken.create({
        data: {
            email,
            token,
            expireAt
        }
    })
}

export async function deletePasswordResetTokenById(id: string) {
    return await db.passwordResetToken.delete({
        where: {
            id
        }
    })
}