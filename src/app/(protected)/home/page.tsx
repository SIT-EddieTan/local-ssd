import { auth, signOut } from "@/auth"

export default async function Home() {
    const session = await auth()
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page</p>
            <p>{JSON.stringify(session)}</p>
            <form action={async () => {
                "use server"
                await signOut()
            }}>
                <button type="submit">Sign out</button>
            </form>
        </div>
    )
}