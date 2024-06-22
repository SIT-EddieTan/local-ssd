import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { findUserById } from "@/data/user-repository"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"
import { delete2FAConfirmationById, get2FAConfirmationByUserId } from "./data/2fa-confirmation-repository"

// Extending the session object to include the user role
declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole
        } & DefaultSession["user"]
    }
}


export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/",
        signOut: "/",
        newUser: "/",
    },
    callbacks: {
        async signIn({ user }) {
            if (!user.id) return false
            const currentUser = await findUserById(user.id)
            // Block users who haven't verified their email 
            if (!currentUser || !currentUser.emailVerified) {
                throw new Error("EmailNotVerified")
            }

            if (currentUser.isTwoFactorAuthEnabled) {
                const twoFactorConfirmation = await get2FAConfirmationByUserId(currentUser.id)

                if (!twoFactorConfirmation) {
                    throw new Error("2FAConfirmationNotFound")
                }

                // Delete the 2FA confirmation record for next sign in
                await delete2FAConfirmationById(twoFactorConfirmation.id)
            }

            return true
        },
        async session({ token, session }) {
            // Adding the user ID to the session
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            // Adding the user role to the session
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            // Adding the user role to the JWT
            const currentUser = await findUserById(token.sub)
            if (currentUser) {
                token.role = currentUser.role
            }

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})