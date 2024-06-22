import { db } from "@/lib/db";

export async function get2FATokenByEmail(email: string) {
    return await db.twoFactorToken.findFirst({
        where: {
            email
        }
    })
}

export async function get2FATokenByToken(token: string) {
    return await db.twoFactorToken.findUnique({
        where: {
            token
        }
    })
}

export async function create2FAToken(email: string, token: string, expireAt: Date) {
    return await db.twoFactorToken.create({
        data: {
            email,
            token,
            expireAt
        }
    })
}

export async function delete2FATokenById(id: string) {
    return await db.twoFactorToken.delete({
        where: {
            id
        }
    })
}
