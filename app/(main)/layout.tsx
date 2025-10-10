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
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(40px) saturate(250%)",
                }}
            >
                <div className="max-w-7xl mx-auto px-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
