"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema } from "@/schema/custom";
import { AlertDestructive } from "@/components/alert-destructive";
import { useState, useTransition } from "react";
import Link from "next/link";
import { AlertSuccess } from "@/components/alert-success";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/token";

export default function ResetPasswordCard() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const userCreateForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        setError("")
        setSuccess("")

        startTransition(() => {
            if (!token) {
                setError("Invalid token.")
                return
            }
            resetPassword(data, token).then((result) => {
                setError(result.error)
                setSuccess(result.success)
            })
        })
    }

    return (
        <Card>
            <CardHeader className="space-y-1 w-[400px]">
                <CardTitle className="text-2xl">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Form {...userCreateForm}>
                    <form onSubmit={userCreateForm.handleSubmit(onSubmit)}>
                        <FormField
                            control={userCreateForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="New Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={userCreateForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="Confirm Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <AlertDestructive className="mt-4" title={error} />
                        <AlertSuccess className="mt-4" title={success} />
                        <Button disabled={isPending} className="w-full mt-4" type="submit">Reset Password</Button>
                    </form>
                </Form>
                <Button variant="link" asChild className="px-0 text-sm font-normal">
                    <Link href="/">Back to Sign In</Link>
                </Button>
            </CardContent>
        </Card >
    )
}
