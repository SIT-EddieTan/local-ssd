import { MainNavItem, SidebarNavItem } from "@/types/nav"

interface DocsConfig {
    mainNav: MainNavItem[]
    sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Documentation",
            href: "/docs",
        },
        {
            title: "Examples",
            href: "/examples",
        }
    ],
    // This is where you define additional links in the sidebar
    sidebarNav: [

    ]
}