'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createAccSchema } from "@/schema/custom";
import { useState, useTransition } from "react";
import { createAcc } from "@/services/user";
import { AlertSuccess } from "@/components/alert-success";
import { AlertDestructive } from "@/components/alert-destructive";

export function CreateAccCard() {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string | undefined>("")
    const [error, setError] = useState<string | undefined>("")

    const userCreateForm = useForm<z.infer<typeof createAccSchema>>({
        resolver: zodResolver(createAccSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    function onSubmit(data: z.infer<typeof createAccSchema>) {
        setError("")
        setSuccess("")

        startTransition(() => {
            createAcc(data).then((result) => {
                if (result.error) {
                    setError(result.error)
                } else {
                    setSuccess(result.success)
                }
            })
        })
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Create an account to access the full features of our application.
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
                        <AlertSuccess className="mt-4" title={success} />
                        <AlertDestructive className="mt-4" title={error} />
                        <Button disabled={isPending} className="w-full mt-4" type="submit">Create Account</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
