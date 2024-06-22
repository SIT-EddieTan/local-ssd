import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInCard } from "@/components/sign-in-card"
import { CreateAccCard } from "@/components/create-acc-card"

export function SignInCreateAccTab() {
    return (
        <Tabs defaultValue="signIn" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signIn">Sign In</TabsTrigger>
                <TabsTrigger value="createAcc">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signIn">
                <SignInCard />
            </TabsContent>
            <TabsContent value="createAcc">
                <CreateAccCard />
            </TabsContent>
        </Tabs>
    )
}