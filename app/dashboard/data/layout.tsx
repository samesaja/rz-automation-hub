import { DataSidebar } from "@/components/data/DataSidebar";

export default function DataLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-full bg-white">
            <DataSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/30">
                {children}
            </div>
        </div>
    )
}
