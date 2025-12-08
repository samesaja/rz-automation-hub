"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullWidth = pathname?.startsWith("/dashboard/ui-builder");

    return (
        <main className={cn("flex-1 overflow-y-auto", !isFullWidth && "p-8")}>
            <div className={cn("h-full", !isFullWidth && "max-w-7xl mx-auto")}>
                {children}
            </div>
        </main>
    );
}
