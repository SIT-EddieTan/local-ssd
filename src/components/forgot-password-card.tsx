"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema } from "@/schema/custom";
import { AlertDestructive } from "@/components/alert-destructive";
import { useState, useTransition } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/user";
import { AlertSuccess } from "@/components/alert-success";

export default function ForgotPasswordCard() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const userCreateForm = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
        setError("")
        setSuccess("")

        startTransition(() => {
            forgotPassword(data).then((result) => {
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
