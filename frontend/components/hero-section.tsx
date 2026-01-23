'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Mail, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './sections.module.css';

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const fullText = 'Frontend Developer';
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const typingSpeed = isDeleting ? 50 : 100;
        const pauseDuration = isDeleting ? 500 : 2000;

        const timeout = setTimeout(() => {
            if (!isDeleting && textIndex < fullText.length) {
                setCurrentText(fullText.substring(0, textIndex + 1));
                setTextIndex(textIndex + 1);
            } else if (!isDeleting && textIndex === fullText.length) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && textIndex > 0) {
                setCurrentText(fullText.substring(0, textIndex - 1));
                setTextIndex(textIndex - 1);
            } else {
                setIsDeleting(false);
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [mounted, textIndex, isDeleting, fullText]);

    const skills = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX'];

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse ${styles['delay-1000']}`}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>

            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                <div
                    className={`transform transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {/* Greeting Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 mb-8 backdrop-blur-md rounded-full border border-white/20 ${styles['colorful-shadow']}`}>
                        {/* <Sparkles className="w-4 h-4 text-primary" /> */}
                        <span className="text-sm font-medium text-foreground/80">
                            Welcome to My Portfolio
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                        <span className={`block bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent ${styles['animate-gradient']}`}>
                            Hi, I&apos;m{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">Developer</span>
                                {/* <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/30 -skew-x-12 blur-sm"></span> */}
                            </span>
                        </span>
                        <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                            {/* I'm a{' '} */}
                            <span className="relative inline-block min-w-[200px] text-left">
                                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                    {currentText}
                                </span>
                                <span className={`inline-block w-0.5 h-8 bg-primary ${styles['hero-animate-blink']} ml-1`}></span>
                            </span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Building functional web experiences with a focus on UX and usability.
                        <br className="hidden sm:block" />
                        Writing human-readable code that&apos;s
                        <br className="hidden sm:block" />
                        easy to understand and simple to modify.
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                        {skills.map((skill, index) => (
                            <div
                                key={skill}
                                className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm hover:bg-white/20"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <span className="text-sm font-medium text-foreground/90">{skill}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Button
                            size="lg"
                            className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                View My Work
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </Button>
                        {/* <Button
                            variant="outline"
                            size="lg"
                            className="group bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download Resume
                        </Button> */}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-6">
                        <a
                            href="#"
                            className="group w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-lg"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
                        </a>
                        <a
                            href="#"
                            className="group w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-lg"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
                        </a>
                        <a
                            href="#"
                            className="group w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-lg"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
