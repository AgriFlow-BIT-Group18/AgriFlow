"use client";

import * as React from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

export function Navbar() {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { key: 'nav_solutions', label: t('nav_solutions'), href: '#solutions' },
        { key: 'nav_impact', label: t('nav_impact'), href: '#impact' },
        { key: 'nav_tech', label: t('nav_tech'), href: '#technology' },
        { key: 'nav_about', label: t('nav_about'), href: '#about' }
    ];

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
            isScrolled || isMenuOpen ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group z-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <Leaf className="text-white" size={24} />
                    </div>
                    <span className={cn(
                        "text-xl sm:text-2xl font-black tracking-tight transition-colors",
                        isScrolled || isMenuOpen ? "text-text-primary" : "text-white"
                    )}>
                        Agri<span className="text-secondary">Flow</span>
                    </span>
                </Link>

                {/* Desktop Nav Items */}
                <div className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.key} 
                            href={item.href} 
                            className={cn(
                                "text-sm font-bold transition-all hover:text-secondary",
                                isScrolled ? "text-text-secondary" : "text-white/80"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <LanguageSelector variant="landing" isScrolled={isScrolled} />
                    <div className="h-8 w-px bg-current opacity-10 mx-2" />
                    <Link href="/login">
                        <Button 
                            variant={isScrolled ? "outline" : "ghost"} 
                            className={cn(
                                "font-bold h-10 px-6",
                                !isScrolled && "text-white hover:bg-white/10"
                            )}
                        >
                            {t('nav_login')}
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button className="font-bold h-10 px-6 shadow-lg shadow-primary/20">
                            {t('nav_get_started')}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle & Lanugage Selector */}
                <div className="flex lg:hidden items-center gap-4 z-50">
                    <LanguageSelector variant="landing" isScrolled={isScrolled || isMenuOpen} />
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                            "p-2 rounded-xl transition-colors",
                            isScrolled || isMenuOpen ? "text-text-primary hover:bg-gray-100" : "text-white hover:bg-white/10"
                        )}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-white z-[60] transition-transform duration-500 lg:hidden flex flex-col pt-24 px-6 shadow-2xl",
                isMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col gap-6 mb-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.key} 
                            href={item.href} 
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-text-primary hover:text-primary transition-colors border-b border-gray-50 pb-4"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                
                <div className="flex flex-col gap-4 mt-auto mb-12">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-14 text-lg font-bold">
                            {t('nav_login')}
                        </Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20">
                            {t('nav_get_started')}
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
