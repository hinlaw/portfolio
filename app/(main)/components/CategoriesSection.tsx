'use client';

import { useState, useEffect, useRef } from 'react';

interface Subcategory {
    id: string;
    title: string;
    description: string;
    imagePlaceholder: string;
}

interface Category {
    id: string;
    title: string;
    subcategories: Subcategory[];
}

export default function CategoriesSection() {
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeSubcategory, setActiveSubcategory] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const categoryRefs = useRef<(HTMLElement | null)[]>([]);

    // Separate state for scroll-based category highlighting
    const [visibleCategory, setVisibleCategory] = useState(0);

    // Sample data - replace with your actual categories and subcategories
    const categoriesData: Category[] = [
        {
            id: 'development',
            title: 'Development',
            subcategories: [
                {
                    id: 'frontend',
                    title: 'Frontend Development',
                    description: 'Modern web applications with React, Next.js, and TypeScript',
                    imagePlaceholder: 'Frontend Development Image'
                },
                {
                    id: 'backend',
                    title: 'Backend Development',
                    description: 'Scalable server-side applications and APIs',
                    imagePlaceholder: 'Backend Development Image'
                },
                {
                    id: 'fullstack',
                    title: 'Full-Stack Solutions',
                    description: 'End-to-end application development',
                    imagePlaceholder: 'Full-Stack Development Image'
                }
            ]
        },
        {
            id: 'design',
            title: 'Design',
            subcategories: [
                {
                    id: 'ui',
                    title: 'UI/UX Design',
                    description: 'User-centered design and interface creation',
                    imagePlaceholder: 'UI/UX Design Image'
                },
                {
                    id: 'branding',
                    title: 'Brand Identity',
                    description: 'Visual identity and brand strategy',
                    imagePlaceholder: 'Brand Identity Image'
                }
            ]
        },
        {
            id: 'consulting',
            title: 'Consulting',
            subcategories: [
                {
                    id: 'tech',
                    title: 'Technical Consulting',
                    description: 'Technology strategy and implementation guidance',
                    imagePlaceholder: 'Technical Consulting Image'
                },
                {
                    id: 'process',
                    title: 'Process Optimization',
                    description: 'Workflow improvement and efficiency enhancement',
                    imagePlaceholder: 'Process Optimization Image'
                }
            ]
        }
    ];

    // Intersection Observer for category tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const categoryId = entry.target.id;
                        const categoryIndex = parseInt(categoryId.split('-')[1]);

                        if (categoryIndex !== visibleCategory) {
                            setVisibleCategory(categoryIndex);
                            // Also update active category and reset to first subcategory
                            setIsFading(true);
                            setTimeout(() => {
                                setActiveCategory(categoryIndex);
                                setActiveSubcategory(0);
                                setIsFading(false);
                            }, 300);
                        }
                    }
                });
            },
            {
                threshold: 0.6,
                rootMargin: '-200px 0px -200px 0px'
            }
        );

        categoryRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            categoryRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [activeCategory]);


    return (
        <section id="categories">
            <div className="flex">
                {/* Left Sidebar - Categories and Subcategories */}
                <div className="w-1/2">
                    {categoriesData.map((category, categoryIndex) => (
                        <div key={category.id} className="min-h-[60vh] flex items-center justify-center">
                            <div
                                id={`category-${categoryIndex}`}
                                ref={(el) => { categoryRefs.current[categoryIndex] = el; }}
                                className="text-center px-8 w-full"
                            >
                                <div
                                    className={`text-4xl font-bold text-gray-900 mb-8 transition-all duration-1500 ease-in ${visibleCategory === categoryIndex
                                        ? 'opacity-100'
                                        : 'opacity-70'
                                        }`}
                                >
                                    {category.title}
                                </div>

                                <div className="space-y-4">
                                    {category.subcategories.map((subcategory, subIndex) => (
                                        <div key={subcategory.id} className="group">
                                            <button
                                                onClick={() => {
                                                    setIsFading(true);
                                                    setTimeout(() => {
                                                        setActiveCategory(categoryIndex);
                                                        setActiveSubcategory(subIndex);
                                                        setIsFading(false);
                                                    }, 300);
                                                }}
                                                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${activeSubcategory === subIndex && activeCategory === categoryIndex
                                                    ? 'bg-blue-100 border-2 border-blue-300'
                                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                            {subcategory.title}
                                                        </h3>
                                                        <p className="text-gray-600">
                                                            {subcategory.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                                        →
                                                    </div>
                                                </div>
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Content - Dynamic Image Display */}
                <div className="w-1/2 sticky top-0 h-[60vh] flex items-center">
                    <div className="p-8 w-full">
                        <div className={`transition-opacity duration-500 ease-in ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center text-gray-500">
                                    <div className="text-2xl font-semibold mb-2">
                                        {categoriesData[activeCategory]?.subcategories[activeSubcategory]?.imagePlaceholder}
                                    </div>
                                    <div className="text-sm">
                                        Image placeholder for: {categoriesData[activeCategory]?.subcategories[activeSubcategory]?.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
