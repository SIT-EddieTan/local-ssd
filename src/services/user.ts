"use server"

import bcrypt from "bcryptjs"
import { createAccSchema } from "@/schema/custom"
import { z } from "zod"
import { addUser, findUserByEmail } from "@/data/user-repository"
import { generate2FAToken, generatePasswordResetToken, generateVerificationToken } from "@/services/token"
import { send2FAEmail, sendPasswordResetEmail, sendVerificationEmail } from "@/services/mail"
import { forgotPasswordSchema } from "@/schema/custom"
import { signInSchema } from "@/schema/custom"
import { signIn as authSignIn } from "@/auth"
import { defaultRedirect } from "@/routes"
import { AuthError } from "next-auth"
import { delete2FATokenById, get2FATokenByEmail } from "@/data/2fa-token-repository"
import { create2FAConfirmation, get2FAConfirmationByUserId } from "@/data/2fa-confirmation-repository"

export async function createAcc(values: z.infer<typeof createAccSchema>) {
    const validation = createAccSchema.safeParse(values)

    if (!validation.success) {
        return { error: "Invalid input" }
    }

    const { email, password } = validation.data

    // Destructure the email and password from the validated data and hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if the user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
        return { error: "Email already exists" }
    }

    // Create the user
    await addUser(email, hashedPassword)

    // Generate a verification token
    const token = await generateVerificationToken(email)

    if (!token) {
        return { error: "Failed to create verification token" }
    }

    await sendVerificationEmail(token.email, token.token)

    return {
        success: "Created account successfully! Please check your email to verify your account."
    }
}

export async function signIn(values: z.infer<typeof signInSchema>) {
    console.log("Sign in service")
    const validation = signInSchema.safeParse(values)

    if (!validation.success) {
        return { error: "Invalid input" }
    }

    const { email, password, code } = validation.data

    const user = await findUserByEmail(email)

    if (!user) {
        return { error: "Invalid credentials" }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        return { error: "Invalid credentials" }
    }

    if (user.isTwoFactorAuthEnabled) {
        console.log("2FA enabled")
        const existing2FAToken = await get2FATokenByEmail(email)
        if (code) {
            if (!existing2FAToken) {
                return { error: "Invalid 2FA code" }
            }

            if (existing2FAToken.token !== code) {
                return { error: "Invalid 2FA code" }
            }

            console.log("2FA token found")

            await delete2FATokenById(existing2FAToken.id)

            const existing2FAConfirmation = await get2FAConfirmationByUserId(user.id)

            if (existing2FAConfirmation) {
                await delete2FATokenById(existing2FAConfirmation.id)
            }

            await create2FAConfirmation(user.id)
        }
        else {
            console.log("2FA token not found or expired")
            if (!existing2FAToken || existing2FAToken.expireAt < new Date()) {
                const twoFactorToken = await generate2FAToken(user.email)
                await send2FAEmail(twoFactorToken.email, twoFactorToken.token)
            }
            return { twoFactor: true }
        }
    }

    try {
        await authSignIn("credentials", { email, password, redirectTo: defaultRedirect })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                case "AccessDenied":
                    const cause = error.cause?.err?.message
                    if (cause === "EmailNotVerified") {
                        return { error: "Email not verified" }
                    }
                    else if (cause === "2FAConfirmationNotFound") {
                        return { error: "2FA confirmation not found" }
                    }
                    break
                default:
                    return { error: "An unknown error occurred" }
            }
        }
        throw error
    }
}

export async function forgotPassword(values: z.infer<typeof forgotPasswordSchema>) {
    const validatedFields = forgotPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid email." }
    }

    const { email } = validatedFields.data

    // Check if email exists in the database
    const user = await findUserByEmail(email)

    if (!user) {
        return { error: "Invalid email." }
    }

    // Send email with reset password link
    const token = await generatePasswordResetToken(email)

    if (!token) {
        return { error: "Failed to generate token." }
    }

    await sendPasswordResetEmail(token.email, token.token)

    return { success: "Check your email for a password reset link." }
}