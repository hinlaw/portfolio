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
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: "Scale Without Hiring",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: "Improve Customer Experience",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Increase Revenue",
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div>
          <div className="grid grid-cols-3 gap-12">
            {/* Left Column - Dynamic Header */}
            <div className="col-span-1">
              <div className="sticky top-24">

                {/* Dynamic Article Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 transition-all duration-700 ease-in-out">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out transform hover:scale-110">
                      {benefitData[activeArticle].icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 transition-all duration-700 ease-in-out">
                      {benefitData[activeArticle].title}
                    </h3>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column - Article Content */}
            <div className="col-span-2">
              <div className="space-y-12">
                <article
                  id="article-0"
                  ref={(el) => { articleRefs.current[0] = el; }}
                  className="bg-white p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Reduce Support Costs by 60%</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Automate routine inquiries and free up your team to focus on complex issues that require human expertise. Our AI handles the majority of common customer questions instantly, reducing the workload on your support staff.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        This dramatic cost reduction comes from eliminating the need for round-the-clock human support while maintaining the same level of service quality. Your team can now focus on strategic initiatives and complex problem-solving.
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  id="article-1"
                  ref={(el) => { articleRefs.current[1] = el; }}
                  className="bg-white p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Scale Without Hiring</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Handle 10x more customer inquiries without expanding your support team or increasing costs. Our AI system can process thousands of conversations simultaneously, something that would require dozens of human agents.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        As your business grows, your AI support scales automatically. No need to recruit, train, or manage additional staff. The system learns and improves with every interaction, becoming more efficient over time.
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  id="article-2"
                  ref={(el) => { articleRefs.current[2] = el; }}
                  className="bg-white p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Improve Customer Experience</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Provide instant, accurate responses that make customers feel valued and supported 24/7. Our AI understands context and provides personalized responses that feel natural and helpful.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        Customers no longer have to wait hours or days for responses. They get immediate help whenever they need it, leading to higher satisfaction scores and stronger brand loyalty.
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  id="article-3"
                  ref={(el) => { articleRefs.current[3] = el; }}
                  className="bg-white p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Increase Revenue</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Faster response times and better service quality lead to higher customer retention and increased sales. Satisfied customers are more likely to make repeat purchases and recommend your business to others.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        Our AI can also identify upselling and cross-selling opportunities during conversations, helping you maximize revenue from every customer interaction while providing genuine value.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}