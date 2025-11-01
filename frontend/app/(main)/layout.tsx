export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {children}
            </div>
        </div>
    );
}
