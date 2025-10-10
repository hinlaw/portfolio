'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [activeArticle, setActiveArticle] = useState(0);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection Observer for article tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleId = entry.target.id;
            const articleIndex = parseInt(articleId.split('-')[1]);
            setActiveArticle(articleIndex);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-100px 0px'
      }
    );

    articleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      articleRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Benefit data for dynamic sidebar
  const benefitData = [
    {
      title: "Reduce Support Costs by 60%",
    },
    {
      title: "Scale Without Hiring",
    },
    {
      title: "Improve Customer Experience",
    },
    {
      title: "Increase Revenue",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Benefits Section */}
      <section id="benefits">
        <div className="flex">
          {/* Left Sidebar - Moving Titles */}
          <div className="w-1/2">
            {benefitData.map((benefit, index) => (
              <div key={index} className="min-h-screen flex items-center justify-center">
                <div className="text-center px-8">
                  <h2 className="text-4xl font-bold text-gray-900 transition-all duration-500">
                    {benefit.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Right Content - Fixed Article */}
          <div className="w-1/2 sticky top-0 h-screen flex items-center">
            <article className="p-8 w-full">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {benefitData[activeArticle].title}
                </h3>
                {activeArticle === 0 && (
                  <>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Automate routine inquiries and free up your team to focus on complex issues that require human expertise. Our AI handles the majority of common customer questions instantly, reducing the workload on your support staff.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      This dramatic cost reduction comes from eliminating the need for round-the-clock human support while maintaining the same level of service quality. Your team can now focus on strategic initiatives and complex problem-solving.
                    </p>
                  </>
                )}
                {activeArticle === 1 && (
                  <>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Handle 10x more customer inquiries without expanding your support team or increasing costs. Our AI system can process thousands of conversations simultaneously, something that would require dozens of human agents.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      As your business grows, your AI support scales automatically. No need to recruit, train, or manage additional staff. The system learns and improves with every interaction, becoming more efficient over time.
                    </p>
                  </>
                )}
                {activeArticle === 2 && (
                  <>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Provide instant, accurate responses that make customers feel valued and supported 24/7. Our AI understands context and provides personalized responses that feel natural and helpful.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Customers no longer have to wait hours or days for responses. They get immediate help whenever they need it, leading to higher satisfaction scores and stronger brand loyalty.
                    </p>
                  </>
                )}
                {activeArticle === 3 && (
                  <>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Faster response times and better service quality lead to higher customer retention and increased sales. Satisfied customers are more likely to make repeat purchases and recommend your business to others.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Our AI can also identify upselling and cross-selling opportunities during conversations, helping you maximize revenue from every customer interaction while providing genuine value.
                    </p>
                  </>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}