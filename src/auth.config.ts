import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/schema/custom"
import { findUserByEmail } from "@/data/user-repository"

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = signInSchema.safeParse(credentials)
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await findUserByEmail(email)
                    if (!user) return null

                    const isPasswordMatch = await bcrypt.compare(password, user.password)
                    if (isPasswordMatch) return user
                }
                return null
            }
        }),
    ]
} satisfies NextAuthConfig