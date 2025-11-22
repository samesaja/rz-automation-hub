export default function DataLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Data Platform</h1>
                    <p className="text-sm text-gray-500">Manage your RZ Data automation data and configuration</p>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                {children}
            </div>
        </div>
    )
}
