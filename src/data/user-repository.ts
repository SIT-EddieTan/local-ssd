import { db } from "@/lib/db";

export async function findUserByEmail(email: string) {
    return await db.user.findUnique({
        where: {
            email
        }
    })
}

export async function addUser(email: string, password: string) {
    return await db.user.create({
        data: {
            email,
            password
        }
    })
}

export async function findUserById(id: string) {
    return await db.user.findUnique({
        where: {
            id
        }
    })
}

/**
 * This function updates the user's email and emailVerified fields for new users and users who have updated their email.
 * 
 * @param id The user id
 * @param email The email to update
 * @param emailVerified The date the email was verified
 * @returns The updated user
 */
export async function updateUserEmail(id: string, email: string, emailVerified: Date) {
    return await db.user.update({
        where: {
            id
        },
        data: {
            email,
            emailVerified
        }
    })
}

export async function updateUserPassword(id: string, password: string) {
    return await db.user.update({
        where: {
            id
        },
        data: {
            password
        }
    })
}