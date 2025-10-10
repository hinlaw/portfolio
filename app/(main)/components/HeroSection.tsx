export default function HeroSection() {
    return (
        <section id="hero" className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center px-8">
                <h1 className="text-6xl font-bold text-gray-900 mb-6">
                    AI-Powered Customer Support
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Transform your customer service with intelligent automation that scales with your business.
                    Reduce costs, improve satisfaction, and boost revenue with our advanced AI solution.
                </p>
                <div className="flex gap-4 justify-center">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Get Started
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}
