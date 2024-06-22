import { db } from "@/lib/db";

export async function getVerificationTokenByEmail(email: string) {
    return await db.verificationToken.findFirst({
        where: {
            email
        }
    })
}

export async function getVerificationTokenByToken(token: string) {
    return await db.verificationToken.findUnique({
        where: {
            token
        }
    })
}

export async function createVerificationToken(email: string, token: string, expireAt: Date) {
    return await db.verificationToken.create({
        data: {
            email,
            token,
            expireAt
        }
    })
}

export async function deleteVerificationTokenById(id: string) {
    return await db.verificationToken.delete({
        where: {
            id
        }
    })
}
