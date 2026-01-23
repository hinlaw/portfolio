'use client';

import { useState, useEffect, useRef } from 'react';

export default function BenefitsSection() {
    const [activeArticle, setActiveArticle] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const titleRefs = useRef<(HTMLElement | null)[]>([]);

    // Intersection Observer for title tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const titleId = entry.target.id;
                        const titleIndex = parseInt(titleId.split('-')[1]);

                        // 如果切換到不同的文章，觸發淡出效果
                        if (titleIndex !== activeArticle) {
                            setIsFading(true);
                            setTimeout(() => {
                                setActiveArticle(titleIndex);
                                setIsFading(false);
                            }, 300); // 300ms 淡出時間
                        }
                    }
                });
            },
            {
                threshold: 0.6,
                rootMargin: '-200px 0px -200px 0px'
            }
        );

        const currentRefs = titleRefs.current;
        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [activeArticle]);

    // Benefit data with titles and articles combined
    const benefitData = [
        {
            title: "Reduce Support Costs by 60%",
            article: (
                <>
                    <p>
                        Automate routine inquiries and free up your team to focus on complex issues that require human expertise. Our AI handles the majority of common customer questions instantly, reducing the workload on your support staff.
                    </p>
                    <p>
                        This dramatic cost reduction comes from eliminating the need for round-the-clock human support while maintaining the same level of service quality. Your team can now focus on strategic initiatives and complex problem-solving.
                    </p>
                </>
            )
        },
        {
            title: "Scale Without Hiring",
            article: (
                <>
                    <p>
                        Handle 10x more customer inquiries without expanding your support team or increasing costs. Our AI system can process thousands of conversations simultaneously, something that would require dozens of human agents.
                    </p>
                    <p>
                        As your business grows, your AI support scales automatically. No need to recruit, train, or manage additional staff. The system learns and improves with every interaction, becoming more efficient over time.
                    </p>
                </>
            )
        },
        {
            title: "Improve Customer Experience",
            article: (
                <>
                    <p>
                        Provide instant, accurate responses that make customers feel valued and supported 24/7. Our AI understands context and provides personalized responses that feel natural and helpful.
                    </p>
                    <p>
                        Customers no longer have to wait hours or days for responses. They get immediate help whenever they need it, leading to higher satisfaction scores and stronger brand loyalty.
                    </p>
                </>
            )
        },
        {
            title: "Increase Revenue",
            article: (
                <>
                    <p>
                        Faster response times and better service quality lead to higher customer retention and increased sales. Satisfied customers are more likely to make repeat purchases and recommend your business to others.
                    </p>
                    <p>
                        Our AI can also identify upselling and cross-selling opportunities during conversations, helping you maximize revenue from every customer interaction while providing genuine value.
                    </p>
                </>
            )
        }
    ];

    return (
        <section id="benefits">
            <div className="flex">
                {/* Left Sidebar - Moving Titles */}
                <div className="w-1/2">
                    {benefitData.map((benefit, index) => (
                        <div key={index} className="min-h-screen flex items-center justify-center">
                            <div
                                id={`title-${index}`}
                                ref={(el) => { titleRefs.current[index] = el; }}
                                className="text-center px-8"
                            >
                                <div
                                    className={`text-3xl font-bold text-gray-900 transition-all duration-1500 ease-in ${activeArticle === index
                                        ? 'opacity-100'
                                        : 'opacity-70'
                                        }`}
                                >
                                    {benefit.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Content - Fixed Article */}
                <div className="w-1/2 sticky top-0 h-screen flex items-center">
                    <article className="p-8 w-full">
                        <div className={`space-y-6 text-gray-600 leading-relaxed text-xl transition-opacity duration-500 ease-in ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                            {benefitData[activeArticle]?.article}
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
