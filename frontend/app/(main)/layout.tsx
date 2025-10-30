export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                backgroundImage: "url('/gradient-background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div>
                <div className="max-w-7xl mx-auto px-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
