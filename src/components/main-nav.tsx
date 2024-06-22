"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { publicRoutes } from "@/routes"

export function MainNav() {
    const pathname = usePathname()
    const isPublicRoute = publicRoutes.includes(pathname)

    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Icons.logo className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">
                    {siteConfig.name}
                </span>
            </Link>

            {!isPublicRoute ? (
                <nav className="flex items-center gap-4 text-sm lg:gap-6">
                    {docsConfig.mainNav?.map(item => (
                        item.href && (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {item.title}
                            </Link>
                        )
                    ))}
                </nav>
            ) : (
                undefined
            )}
        </div>
    )
}