import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { publicRoutes, redirectLoggedInRoutes, apiAuthPrefix, defaultRedirect } from "@/routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isRedirectLoggedInRoute = redirectLoggedInRoutes.includes(nextUrl.pathname)
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

    if (isApiAuthRoute) {
        return undefined
    }

    if (isRedirectLoggedInRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(defaultRedirect, nextUrl))
        }
    }

    if (!isPublicRoute && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl))
    }

    return undefined
})

// Invoke middleware for all routes except for static files and the /api and /trpc routes
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}