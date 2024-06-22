'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInSchema } from "@/schema/custom";
import { AlertDestructive } from "@/components/alert-destructive";
import { signIn } from "@/services/user";
import { useState, useTransition } from "react";
import { generateVerificationToken } from "@/services/token";
import { sendVerificationEmail } from "@/services/mail";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export function SignInCard() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [email, setEmail] = useState<string>("")
    const [show2FA, setShow2FA] = useState<boolean>(false)

    const userCreateForm = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        }
    })

    function onSubmit(data: z.infer<typeof signInSchema>) {
        setError("")

        startTransition(() => {
            data.email && setEmail(data.email)
            signIn(data).then((result) => {
                if (result?.error) {
                    userCreateForm.reset()
                    setError(result.error)
                    // Reset show2FA to false if the error is related to OTP
                    if (result.error === "Invalid 2FA code") {
                        setShow2FA(false)
                    }
                } else if (result?.twoFactor) {
                    setShow2FA(true)
                } else {
                    // Handle successful sign-in
                    console.log("Sign-in successful")
                }
            }).catch((err) => {
                setError("An unexpected error occurred")
            })
        })
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                    Sign in to access the full features of our application.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Form {...userCreateForm}>
                    <form onSubmit={userCreateForm.handleSubmit(onSubmit)}>
                        {show2FA && (
                            <FormField
                                control={userCreateForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>2FA Code</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup >
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the 6-digit code from your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        )}
                        {!show2FA && (
                            <>
                                <FormField
                                    control={userCreateForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Email"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <FormField
                                    control={userCreateForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </>
                        )}
                        <AlertDestructive
                            className="mt-4"
                            title={error}
                            description={error === "Email not verified" ? "Please verify your email before signing in. Click the link below to resend the verification email." : ""}
                            actionText={error === "Email not verified" ? "Resend verification email" : undefined}
                            onActionClick={error === "Email not verified" ? async () => {
                                const token = await generateVerificationToken(email)
                                if (token) {
                                    await sendVerificationEmail(token.email, token.token)
                                }
                            } : undefined}
                        />
                        <Button size="sm" variant="link" asChild className="px-0 text-sm font-normal">
                            <Link href="/forgot-password">Forgot Password?</Link>
                        </Button>
                        <Button disabled={isPending} className="w-full mt-4" type="submit">Sign In</Button>
                    </form>
                </Form>

            </CardContent>
        </Card >
    )
}