'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifyEmail } from "@/services/token";
import { AlertSuccess } from "@/components/alert-success";
import { AlertDestructive } from "@/components/alert-destructive";

export function VerifyEmailCard() {
    const searchParams = useSearchParams()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const token = searchParams.get('token')

    const onSubmit = useCallback(() => {
        if (!token) {
            setError('Mising token.')
            return
        }
        verifyEmail(token).then((data) => {
            setError(data.error)
            setSuccess(data.success)
        }).catch(() => {
            setError("Something went wrong.")
        })
    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <Card>
            <CardHeader className="space-y-1 w-[400px]">
                <CardTitle className="text-2xl">Verify Email</CardTitle>
                <CardDescription>
                    Verifying your email address.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {!error && !success &&
                    (<div className="flex justify-center">
                        <svg className="animate-spin h-10 w-10 mr-10" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>)
                }
                <AlertSuccess className="mt-4" title={success} />
                <AlertDestructive className="mt-4" title={error} />
                <Button asChild className="w-full mt-4">
                    <Link href="/">Back to Sign In</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
