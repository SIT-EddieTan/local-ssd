/**
 * List of public routes that are accessible to the public
 */
export const publicRoutes = [
    "/",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
]

/**
 * List of routes that will redirect logged in users to the home page
 */
export const redirectLoggedInRoutes = [
    "/",
]

/**
 * The prefix for API authentication routes
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect route for authenticated users
 */
export const defaultRedirect = "/home"