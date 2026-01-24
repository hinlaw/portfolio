'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './sections.module.css';

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
    const isUpdatingRef = useRef(false);

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
                // Find the most visible category (highest intersection ratio)
                let mostVisible: number | null = null;
                let highestRatio = 0;

                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                        highestRatio = entry.intersectionRatio;
                        const categoryId = entry.target.id;
                        const categoryIndex = parseInt(categoryId.split('-')[1]);
                        mostVisible = categoryIndex;
                    }
                });

                // Only update if we found a category and it's different, and not currently updating
                if (mostVisible !== null && mostVisible !== visibleCategory && !isUpdatingRef.current) {
                    isUpdatingRef.current = true;
                    setVisibleCategory(mostVisible);
                    // Also update active category and reset to first subcategory
                    setIsFading(true);
                    const categoryToSet = mostVisible;
                    setTimeout(() => {
                        setActiveCategory(categoryToSet);
                        setActiveSubcategory(0);
                        setIsFading(false);
                        isUpdatingRef.current = false;
                    }, 300);
                }
            },
            {
                threshold: [0.3, 0.5, 0.7],
                rootMargin: '-200px 0px -200px 0px'
            }
        );

        const currentRefs = categoryRefs.current;
        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [visibleCategory]);


    return (
        <section id="categories">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                {/* Gradient Orbs */}
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse ${styles['delay-1000']}`}></div>
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse ${styles['delay-2000']}`}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

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
                                    className={`text-4xl font-bold mb-8 transition-all duration-1500 ease-in ${visibleCategory === categoryIndex
                                        ? 'opacity-100'
                                        : 'opacity-70'
                                        }`}
                                >
                                    <span className="">
                                        {category.title}
                                    </span>
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
                                                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] ${activeSubcategory === subIndex && activeCategory === categoryIndex
                                                    ? `${styles['categories-glass-card-active']} ${styles['colorful-shadow']}`
                                                    : `${styles['categories-glass-card']} hover:bg-white/20`
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h3 className={`text-xl font-semibold mb-2 transition-colors ${activeSubcategory === subIndex && activeCategory === categoryIndex
                                                            ? 'bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'
                                                            : 'text-foreground'
                                                            }`}>
                                                            {subcategory.title}
                                                        </h3>
                                                        <p className={`transition-colors ${activeSubcategory === subIndex && activeCategory === categoryIndex
                                                            ? 'text-foreground/80'
                                                            : 'text-foreground/60'
                                                            }`}>
                                                            {subcategory.description}
                                                        </p>
                                                    </div>
                                                    <div className={`ml-4 transition-all duration-300 ${activeSubcategory === subIndex && activeCategory === categoryIndex
                                                        ? 'text-primary translate-x-1 scale-110'
                                                        : 'text-foreground/40 group-hover:text-foreground/70 group-hover:translate-x-1'
                                                        }`}>
                                                        <ArrowRight className="w-5 h-5" />
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
                            <div className={`${styles['categories-image-container']} rounded-lg h-96 flex items-center justify-center shadow-xl ${styles['colorful-shadow']}`}>
                                <div className="text-center px-8">
                                    <div className={`text-2xl md:text-3xl font-semibold mb-3 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent ${styles['animate-gradient']}`}>
                                        {categoriesData[activeCategory]?.subcategories[activeSubcategory]?.imagePlaceholder}
                                    </div>
                                    <div className="text-sm md:text-base text-foreground/60">
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
