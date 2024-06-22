"use server"

import crypto from "crypto"
import bcrypt from "bcryptjs"
import { createPasswordResetToken, deletePasswordResetTokenById, getPasswordResetTokenByEmail, getPasswordResetTokenByToken } from '@/data/password-reset-token-repository'
import { findUserByEmail, updateUserEmail, updateUserPassword } from '@/data/user-repository'
import { createVerificationToken, deleteVerificationTokenById, getVerificationTokenByEmail, getVerificationTokenByToken } from '@/data/verification-token-repository'
import { v4 as uuid } from 'uuid'
import { resetPasswordSchema } from "@/schema/custom"
import { z } from "zod"
import { create2FAToken, delete2FATokenById, get2FATokenByEmail } from "@/data/2fa-token-repository"

export async function generate2FAToken(email: string) {
    const token = crypto.randomInt(100000, 1000000).toString()
    const expireAt = new Date(new Date().getTime() + 600 * 1000) // 10 minutes from now

    const existingToken = await get2FATokenByEmail(email)

    if (existingToken) {
        await delete2FATokenById(existingToken.id)
    }

    const newToken = await create2FAToken(email, token, expireAt)

    return newToken
}

export async function generateVerificationToken(email: string) {
    const existingUser = await findUserByEmail(email)
    if (!existingUser) {
        return null
    }

    const token = uuid()
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hour from now

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
        await deleteVerificationTokenById(existingToken.id)
    }

    const newToken = await createVerificationToken(email, token, expiresAt)

    return newToken
}

export async function verifyEmail(token: string) {
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        return { error: "Invalid token." }
    }

    if (existingToken.expireAt < new Date()) {
        return { error: "Token expired." }
    }

    const existingUser = await findUserByEmail(existingToken.email)
    if (!existingUser) {
        return { error: "Email not found." }
    }

    await updateUserEmail(existingUser.id, existingUser.email, new Date())

    await deleteVerificationTokenById(existingToken.id)

    return { success: "Email verified." }
}

export async function generatePasswordResetToken(email: string) {
    const existingUser = await findUserByEmail(email)
    if (!existingUser) {
        return null
    }

    const token = uuid()
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hour from now

    const existingToken = await getPasswordResetTokenByEmail(email)

    if (existingToken) {
        await deletePasswordResetTokenById(existingToken.id)
    }

    const newToken = await createPasswordResetToken(email, token, expiresAt)

    return newToken
}

export async function resetPassword(values: z.infer<typeof resetPasswordSchema>, token: string) {
    const validatedFields = resetPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid input." }
    }

    const { password, confirmPassword } = validatedFields.data

    if (password !== confirmPassword) {
        return { error: "Passwords do not match." }
    }

    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
        return { error: "Invalid token." }
    }

    if (existingToken.expireAt < new Date()) {
        return { error: "Token expired." }
    }

    const existingUser = await findUserByEmail(existingToken.email)

    if (!existingUser) {
        return { error: "Invalid Token." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await updateUserPassword(existingUser.id, hashedPassword)

    await deletePasswordResetTokenById(existingToken.id)

    return { success: "Password reset." }
}